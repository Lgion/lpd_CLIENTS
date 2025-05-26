"use client"
import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, DatePicker, Input, InputNumber, Select, Space, Tag, message } from 'antd'
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import moment from 'moment'

const { RangePicker } = DatePicker
const { Search } = Input

export default function ReservationManager() {
  const [reservations, setReservations] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPromotionModalVisible, setIsPromotionModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [dateRange, setDateRange] = useState(null)
  const [showArchived, setShowArchived] = useState(false)
  const [form] = Form.useForm()
  const [promotionForm] = Form.useForm()

  // Charger les réservations
  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservation')
      const data = await response.json()
      console.log("Réservations reçues:", data)
      setReservations(data)
    } catch (error) {
      console.error('Erreur détaillée:', error)
      message.error('Erreur lors du chargement des réservations')
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  // Ajouter une fonction de gestion des dates
  const handleDateRangeChange = (dates, dateStrings) => {
    console.log('Dates reçues du RangePicker:', dates);
    console.log('Dates en format string:', dateStrings);
    
    if (dates) {
      // Créer de nouveaux objets moment à partir des chaînes de date
      const [startStr, endStr] = dateStrings;
      const startDate = moment(startStr, 'DD/MM/YYYY').startOf('day');
      const endDate = moment(endStr, 'DD/MM/YYYY').endOf('day');
      

      console.log('Dates converties:', {
        start: startDate.format('YYYY-MM-DD HH:mm:ss'),
        end: endDate.format('YYYY-MM-DD HH:mm:ss')
      });
      setDateRange([startDate, endDate]);
    } else {
      setDateRange(null);
    }
  };

  // Filtrer les réservations
  const filteredReservations = reservations.filter(reservation => {
    const searchLower = searchText.toLowerCase();
    
    // Debug des dates
    console.log('État actuel de dateRange:', dateRange);
    
    // Convertir les dates de la réservation en objets moment
    const reservationStart = moment(reservation.from).startOf('day');
    const reservationEnd = moment(reservation.to).endOf('day');
    
    // Vérifier si une plage de dates est sélectionnée
    const dateInRange = !dateRange || (
      reservationStart.isSameOrAfter(dateRange[0], 'day') &&
      reservationEnd.isSameOrBefore(dateRange[1], 'day')
    );
    
    console.log('Comparaison des dates pour réservation:', {
      reservation_id: reservation._id,
      reservationStart: reservationStart.format('YYYY-MM-DD HH:mm:ss'),
      reservationEnd: reservationEnd.format('YYYY-MM-DD HH:mm:ss'),
      rangeStart: dateRange ? dateRange[0].format('YYYY-MM-DD HH:mm:ss') : 'pas de date',
      rangeEnd: dateRange ? dateRange[1].format('YYYY-MM-DD HH:mm:ss') : 'pas de date',
      dateInRange
    });
    
    // Vérifier si isArchived est défini, sinon considérer comme non archivé
    const isArchivedMatch = typeof reservation.isArchived === 'undefined' 
      ? !showArchived  // Si isArchived n'est pas défini, montrer dans la vue normale
      : reservation.isArchived === showArchived;

    return dateInRange && 
      (searchText === '' ||
        reservation.community?.toLowerCase().includes(searchLower) ||
        reservation.names?.toLowerCase().includes(searchLower) ||
        reservation.email?.toLowerCase().includes(searchLower) ||
        reservation.phone_number?.includes(searchText)
      ) &&
      isArchivedMatch;
  });

  // Gérer la validation du paiement
  const handlePaymentValidation = async (record) => {
    try {
      const response = await fetch(`/api/reservation?id=${record._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...record,
          avance_payee: !record.avance_payee
        }),
      })

      if (response.ok) {
        message.success('Statut du paiement mis à jour')
        fetchReservations()
      }
    } catch (error) {
      message.error('Erreur lors de la mise à jour du statut de paiement')
    }
  }

  // Gérer la validation de la réservation
  const handleReservationValidation = async (record) => {
    try {
      const response = await fetch(`/api/reservation?id=${record._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...record,
          isValidated: !record.isValidated
        }),
      })

      if (response.ok) {
        message.success(`Réservation ${record.isValidated ? 'invalidée' : 'validée'} avec succès`)
        fetchReservations()
      }
    } catch (error) {
      message.error('Erreur lors de la validation de la réservation')
    }
  }

  // Gérer l'archivage d'une réservation
  const handleArchive = async (record) => {
    try {
      const response = await fetch(`/api/reservation?id=${record._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...record,
          isArchived: !record.isArchived
        }),
      })

      if (response.ok) {
        message.success(`Réservation ${record.isArchived ? 'désarchivée' : 'archivée'} avec succès`)
        fetchReservations()
      }
    } catch (error) {
      message.error('Erreur lors de l\'archivage de la réservation')
    }
  }

  // Gérer la suppression d'une réservation
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/reservation?id=${editingReservation._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        message.success('Réservation supprimée avec succès')
        setIsDeleteModalVisible(false)
        fetchReservations()
      }
    } catch (error) {
      message.error('Erreur lors de la suppression de la réservation')
    }
  }

  // Gérer l'application d'une promotion
  const handlePromotionSubmit = async (values) => {
    try {
      const response = await fetch(`/api/reservation?id=${editingReservation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingReservation,
          montant_total: Math.round(editingReservation.montant_total * (1 - values.reduction / 100)),
          montant_avance: Math.round(editingReservation.montant_avance * (1 - values.reduction / 100))
        }),
      })

      if (response.ok) {
        message.success('Promotion appliquée avec succès')
        setIsPromotionModalVisible(false)
        fetchReservations()
        promotionForm.resetFields()
      }
    } catch (error) {
      message.error('Erreur lors de l\'application de la promotion')
    }
  }

  // Colonnes du tableau
  const columns = [
    {
      title: 'Dates',
      key: 'dates',
      render: (_, record) => (
        <>
          <div>Du: {moment(record.from).format('DD/MM/YYYY')}</div>
          <div>Au: {moment(record.to).format('DD/MM/YYYY')}</div>
        </>
      ),
      sorter: (a, b) => moment(a.from).unix() - moment(b.from).unix()
    },
    {
      title: 'Communauté',
      dataIndex: 'community',
      key: 'community',
    },
    {
      title: 'Type',
      dataIndex: 'type_reservation',
      key: 'type',
      render: (type) => (
        <Tag color={
          type === 'pray' ? 'blue' :
          type === 'retraite' ? 'green' :
          type === 'celebration' ? 'gold' :
          type === 'repos' ? 'cyan' :
          type === 'longTerm' ? 'purple' : 'default'
        }>
          {type}
        </Tag>
      )
    },
    {
      title: 'Participants',
      key: 'participants',
      render: (_, record) => (
        <>
          <div>Total: {record.participants}</div>
          {record.individual_room_participants > 0 && (
            <div>Ch. indiv.: {record.individual_room_participants}</div>
          )}
        </>
      )
    },
    {
      title: 'Montants',
      key: 'montants',
      render: (_, record) => (
        <>
          <div>Total: {record.montant_total}F</div>
          <div>Avance: {record.montant_avance}F</div>
          <Space direction="vertical" size={4}>
            <Tag color={record.avance_payee ? 'success' : 'error'}>
              {record.avance_payee ? 'Payé' : 'Avance en attente'}
            </Tag>
            <Tag color={record.isValidated ? 'success' : 'warning'}>
              {record.isValidated ? 'Validée' : 'Réservation non validée'}
            </Tag>
          </Space>
        </>
      )
    }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Space size="large" style={{ marginBottom: '10px' }}>
          <Search
            placeholder="Rechercher..."
            allowClear
            onSearch={setSearchText}
            style={{ width: 300 }}
          />
          <RangePicker
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            style={{ minWidth: '240px' }}
            placeholder={['Date début', 'Date fin']}
            allowClear={true}
            showTime={false}
          />
          <Button
            type={showArchived ? 'primary' : 'default'}
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? 'Voir réservations actives' : 'Voir archives'}
          </Button>
        </Space>
        <ul style={{}}>
          <p style={{}}>Ce filtre s'applique sur les propriétés suivantes: 
          </p>
          <li>La communauté (community)</li>
          <li>Le nom (names)</li>
          <li>L'email (email)</li>
          <li>Le numéro de téléphone (phone_number)</li>
        </ul>
      </div>

      <Table
        columns={columns}
        dataSource={filteredReservations}
        rowKey="_id"
        scroll={{ x: true }}
        onRow={(record) => ({
          onClick: () => {
            setEditingReservation(record)
            setIsDetailsModalVisible(true)
          },
          style: { cursor: 'pointer' }
        })}
      />

      {/* Modal de détails */}
      <Modal
        title={`Détails de la réservation - ${editingReservation?.community || ''}`}
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        width={800}
        footer={[
          <Button
            key="validate"
            type={editingReservation?.isValidated ? 'default' : 'primary'}
            icon={editingReservation?.isValidated ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => {
              handleReservationValidation(editingReservation)
              setIsDetailsModalVisible(false)
            }}
          >
            {editingReservation?.isValidated ? 'Invalider' : 'Valider'} réservation
          </Button>,
          <Button
            key="payment"
            type={editingReservation?.avance_payee ? 'default' : 'primary'}
            icon={editingReservation?.avance_payee ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => {
              handlePaymentValidation(editingReservation)
              setIsDetailsModalVisible(false)
            }}
          >
            {editingReservation?.avance_payee ? 'Annuler' : 'Valider'} avance pécunière
          </Button>,
          <Button
            key="promotion"
            onClick={() => {
              setIsPromotionModalVisible(true)
              setIsDetailsModalVisible(false)
            }}
          >
            Réduction
          </Button>,
          <Button
            key="archive"
            type={editingReservation?.isArchived ? 'default' : 'dashed'}
            onClick={() => {
              handleArchive(editingReservation)
              setIsDetailsModalVisible(false)
            }}
          >
            {editingReservation?.isArchived ? 'Désarchiver' : 'Archiver'}
          </Button>,
          <Button
            key="delete"
            danger
            onClick={() => {
              setIsDeleteModalVisible(true)
              setIsDetailsModalVisible(false)
            }}
          >
            Supprimer
          </Button>
        ]}
      >
        <div className="reservation-details">
          <div className="detail-section">
            <h3>Informations de contact</h3>
            <p><strong>Nom:</strong> {editingReservation?.names}</p>
            <p><strong>Email:</strong> {editingReservation?.email}</p>
            <p><strong>Téléphone:</strong> {editingReservation?.phone_number}</p>
          </div>

          <div className="detail-section">
            <h3>Détails du séjour</h3>
            <p><strong>Dates:</strong> Du {moment(editingReservation?.from).format('DD/MM/YYYY')} au {moment(editingReservation?.to).format('DD/MM/YYYY')}</p>
            <p><strong>Type:</strong> {editingReservation?.type_reservation}</p>
            <p><strong>Participants:</strong> {editingReservation?.participants} au total</p>
            {editingReservation?.individual_room_participants > 0 && (
              <p><strong>Chambres individuelles:</strong> {editingReservation?.individual_room_participants}</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Repas</h3>
            {editingReservation?.meal_included ? (
              <>
                <p><strong>Plan de repas:</strong> {editingReservation?.meal_plan === 1 ? '1 repas + PDJ' : '2 repas + PDJ'}</p>
                {editingReservation?.meals?.breakfast && <p><strong>Petit-déjeuner:</strong> {editingReservation?.meals.breakfast}</p>}
                {editingReservation?.meals?.lunch && <p><strong>Déjeuner:</strong> {editingReservation?.meals.lunch}</p>}
                {editingReservation?.meals?.dinner && <p><strong>Dîner:</strong> {editingReservation?.meals.dinner}</p>}
              </>
            ) : (
              <p>Repas non inclus</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Informations financières</h3>
            <p><strong>Montant total:</strong> {editingReservation?.montant_total}F</p>
            <p><strong>Avance:</strong> {editingReservation?.montant_avance}F</p>
            <p><strong>Statut du paiement:</strong> {editingReservation?.avance_payee ? 'Payé' : 'Avance en attente'}</p>
            <p><strong>Statut de la réservation:</strong> {editingReservation?.isValidated ? 'Validée' : 'Non validée'}</p>
          </div>
        </div>
      </Modal>

      {/* Modal pour les promotions */}
      <Modal
        title="Appliquer une promotion"
        open={isPromotionModalVisible}
        onCancel={() => {
          setIsPromotionModalVisible(false)
          promotionForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={promotionForm}
          onFinish={handlePromotionSubmit}
          layout="vertical"
        >
          <Form.Item
            name="reduction"
            label="Réduction (%)"
            rules={[
              { required: true, message: 'Veuillez entrer le pourcentage de réduction' },
              { type: 'number', min: 0, max: 100, message: 'La réduction doit être entre 0 et 100%' }
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Appliquer la promotion
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        title="Confirmer la suppression"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Supprimer"
        cancelText="Annuler"
      >
        <p>Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.</p>
      </Modal>
    </div>
  )
}
