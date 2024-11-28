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

  // Filtrer les réservations
  const filteredReservations = reservations.filter(reservation => {
    const searchLower = searchText.toLowerCase()
    const dateInRange = !dateRange || (
      moment(reservation.from).isSameOrAfter(dateRange[0], 'day') &&
      moment(reservation.to).isSameOrBefore(dateRange[1], 'day')
    )
    
    // Vérifier si isArchived est défini, sinon considérer comme non archivé
    const isArchivedMatch = typeof reservation.isArchived === 'undefined' 
      ? !showArchived  // Si isArchived n'est pas défini, montrer dans la vue normale
      : reservation.isArchived === showArchived

    return dateInRange && 
      (searchText === '' ||
        reservation.community?.toLowerCase().includes(searchLower) ||
        reservation.names?.toLowerCase().includes(searchLower) ||
        reservation.email?.toLowerCase().includes(searchLower) ||
        reservation.phone_number?.includes(searchText)
      ) &&
      isArchivedMatch
  })

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
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <>
          <div>{record.names}</div>
          <div>{record.email}</div>
          <div>{record.phone_number}</div>
        </>
      )
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
      title: 'Repas',
      key: 'meals',
      render: (_, record) => (
        record.meal_included ? (
          <>
            <div>Plan: {record.meal_plan === 1 ? '1 repas + PDJ' : '2 repas + PDJ'}</div>
            {record.meals.breakfast && <div>PDJ: {record.meals.breakfast}</div>}
            {record.meals.lunch && <div>Déj: {record.meals.lunch}</div>}
            {record.meals.dinner && <div>Dîner: {record.meals.dinner}</div>}
          </>
        ) : 'Non inclus'
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
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type={record.isValidated ? 'default' : 'primary'}
            icon={record.isValidated ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleReservationValidation(record)}
          >
            {record.isValidated ? 'Invalider' : 'Valider'} réservation
          </Button>
          <Button 
            type={record.avance_payee ? 'default' : 'primary'}
            icon={record.avance_payee ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handlePaymentValidation(record)}
          >
            {record.avance_payee ? 'Annuler' : 'Valider'} avance pécunière
          </Button>
          <Button 
            onClick={() => {
              setEditingReservation(record)
              setIsPromotionModalVisible(true)
            }}
          >
            Réduction
          </Button>
          <Button
            type={record.isArchived ? 'default' : 'dashed'}
            onClick={() => handleArchive(record)}
          >
            {record.isArchived ? 'Désarchiver' : 'Archiver'}
          </Button>
          <Button
            danger
            onClick={() => {
              setEditingReservation(record)
              setIsDeleteModalVisible(true)
            }}
          >
            Supprimer
          </Button>
        </Space>
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
            onChange={setDateRange}
            format="DD/MM/YYYY"
          />
          <Button
            type={showArchived ? 'primary' : 'default'}
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? 'Voir réservations actives' : 'Voir archives'}
          </Button>
        </Space>
        <ul style={{fontSize:".8em"}}>
          <p style={{fontSize:".8em"}}>Ce filtre s'applique sur les propriétés suivantes: 
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
      />

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
