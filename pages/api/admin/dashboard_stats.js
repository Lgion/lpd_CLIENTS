import dbConnect from '../lib/dbConnect';
import modelReservation from '../_/models/Reservation';
import User_lpd from '../_/models/User_lpd';
import Articles from '../_/models/Articles';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await dbConnect();

        // 1. Get stats
        const totalReservations = await modelReservation.countDocuments();
        const totalProducts = await Articles.countDocuments();

        // 2. Get latest reservations
        const latestReservations = await modelReservation.find({})
            .sort({ from: -1 })
            .limit(5);

        // 3. Get latest sales (scanning all users for ecom orders)
        // This is inefficient but necessary given the schema
        const usersWithEcom = await User_lpd.find({ 'commandes.ecom': { $exists: true, $not: { $size: 0 } } });

        let allSales = [];
        usersWithEcom.forEach(user => {
            if (user.commandes && user.commandes.ecom) {
                user.commandes.ecom.forEach(sale => {
                    allSales.push({
                        ...sale,
                        userEmail: user.email,
                        userName: user.fullName || 'Client Anonyme'
                    });
                });
            }
        });

        // Sort sales by date (assuming they have a date field, let's check Sale object structure if possible)
        // If they don't have a date, we just take the ones from the latest updated users.
        allSales.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
            return dateB - dateA;
        });

        const latestSales = allSales.slice(0, 5);
        const totalSalesCount = allSales.length;
        const totalSalesRevenue = allSales.reduce((sum, sale) => sum + (parseFloat(sale.total) || 0), 0);

        // 4. Get Google Analytics Stats
        let gaData = "Non configuré";
        try {
            const propertyId = process.env.GA_PROPERTY_ID?.replace(/"/g, '');
            const clientEmail = process.env.GA_CLIENT_EMAIL?.replace(/"/g, '');
            const privateKey = process.env.GA_PRIVATE_KEY;
            
            if (propertyId && clientEmail && privateKey) {
                const { BetaAnalyticsDataClient } = require('@google-analytics/data');
                
                // Nettoyage de la clé (les \n dans le .env arrivent parfois mal formatés)
                const formattedKey = privateKey.replace(/\\n/g, '\n').replace(/"/g, '');

                const analyticsDataClient = new BetaAnalyticsDataClient({
                    credentials: {
                        client_email: clientEmail,
                        private_key: formattedKey,
                    }
                });

                // 1. Général + E-commerce + Sessions (30j)
                const [overviewResponse] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    metrics: [
                        { name: 'activeUsers' }, 
                        { name: 'newUsers' }, 
                        { name: 'screenPageViews' },
                        { name: 'averageSessionDuration' },
                        { name: 'engagementRate' },
                        { name: 'purchaseRevenue' },
                        { name: 'transactions' },
                        { name: 'sessions' }
                    ],
                });

                // 2. Top Pages
                const [pagesResponse] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'pageTitle' }],
                    metrics: [{ name: 'screenPageViews' }],
                    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
                    limit: 50
                });
                
                // 3. Appareils
                const [devicesResponse] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'deviceCategory' }],
                    metrics: [{ name: 'activeUsers' }],
                    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
                });

                // 4. Sources
                const [sourcesResponse] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'sessionSource' }],
                    metrics: [{ name: 'sessions' }],
                    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
                    limit: 5
                });

                // 5. Engagement par Page
                const [engagementResponsePage] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'pageTitle' }],
                    metrics: [{ name: 'averageSessionDuration' }],
                    orderBys: [{ metric: { metricName: 'averageSessionDuration' }, desc: true }],
                    limit: 50
                });

                // 6. Top Produits
                const [productsResponse] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'itemName' }],
                    metrics: [{ name: 'itemsPurchased' }],
                    orderBys: [{ metric: { metricName: 'itemsPurchased' }, desc: true }],
                    limit: 5
                });

                // 7. Dons
                const [donationsResponse] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'eventName' }],
                    metrics: [{ name: 'eventCount' }, { name: 'eventValue' }],
                    dimensionFilter: {
                        filter: {
                            fieldName: 'eventName',
                            stringFilter: { value: 'donation_complete' }
                        }
                    }
                });

                // 8. Clics & Engagement
                const [engagementResponseDict] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'eventName' }],
                    metrics: [{ name: 'eventCount' }],
                    dimensionFilter: {
                        filter: {
                            fieldName: 'eventName',
                            inListFilter: {
                                values: ['contact_whatsapp', 'add_to_cart', 'view_item', 'begin_donation', 'donation_complete', 'begin_reservation']
                            }
                        }
                    }
                });

                // 9. Géo
                const [geoResponse] = await analyticsDataClient.runReport({
                    property: `properties/${propertyId}`,
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'country' }],
                    metrics: [{ name: 'activeUsers' }],
                    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
                    limit: 5
                });

                const overviewRaw = overviewResponse.rows?.[0]?.metricValues || [];
                const donationStats = donationsResponse.rows?.[0]?.metricValues || [{ value: 0 }, { value: 0 }];
                
                const engagement = {};
                engagementResponseDict.rows?.forEach(row => {
                    engagement[row.dimensionValues[0].value] = row.metricValues[0].value;
                });
                
                const getTopPlusSchool = (rows, metricIndex, labelKey) => {
                    const allPages = rows?.map(row => ({
                        [labelKey]: row.dimensionValues[0].value,
                        value: row.metricValues[metricIndex].value
                    })) || [];
                    const schoolPage = allPages.find(p => p[labelKey] && (p[labelKey].toLowerCase().includes('école') || p[labelKey].toLowerCase().includes('ecole') || p[labelKey].toLowerCase().includes('don')));
                    const otherPages = allPages.filter(p => p !== schoolPage).slice(0, schoolPage ? 4 : 5);
                    return schoolPage ? [...otherPages, schoolPage] : otherPages;
                };

                gaData = {
                    visitors: overviewRaw[0]?.value || 0,
                    newUsers: overviewRaw[1]?.value || 0,
                    pageViews: overviewRaw[2]?.value || 0,
                    avgSession: overviewRaw[3]?.value ? Math.round(Number(overviewRaw[3].value)) : 0,
                    engagementRate: overviewRaw[4]?.value ? Math.round(Number(overviewRaw[4].value) * 100) : 0,
                    revenue: overviewRaw[5]?.value || 0,
                    transactions: overviewRaw[6]?.value || 0,
                    sessions: overviewRaw[7]?.value || 0,
                    donationCount: donationStats[0]?.value || 0,
                    donationValue: Math.round(Number(donationStats[1]?.value || 0)),
                    engagement,
                    topPages: getTopPlusSchool(pagesResponse.rows, 0, 'title').map(p => ({ title: p.title, views: p.value })),
                    engagementPages: getTopPlusSchool(engagementResponsePage.rows, 0, 'title').map(p => ({ title: p.title, duration: Math.round(Number(p.value)) })),
                    topProducts: productsResponse.rows?.map(row => ({ name: row.dimensionValues[0].value, sold: row.metricValues[0].value })),
                    devices: devicesResponse.rows?.map(row => ({ device: row.dimensionValues[0].value, users: row.metricValues[0].value })),
                    sources: sourcesResponse.rows?.map(row => ({ name: row.dimensionValues[0].value, sessions: row.metricValues[0].value })),
                    countries: geoResponse.rows?.map(row => ({ country: row.dimensionValues[0].value, users: row.metricValues[0].value }))
                };
            }
        } catch (gaError) {
            console.error('GA Error Detail:', gaError.message);
            gaData = "Erreur de configuration";
        }

        return res.status(200).json({
            stats: {
                totalReservations,
                totalProducts,
                totalSalesCount,
                totalSalesRevenue,
                gaData
            },
            latestReservations,
            latestSales
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
