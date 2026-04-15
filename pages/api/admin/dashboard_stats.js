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

        return res.status(200).json({
            stats: {
                totalReservations,
                totalProducts,
                totalSalesCount,
                totalSalesRevenue
            },
            latestReservations,
            latestSales
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
