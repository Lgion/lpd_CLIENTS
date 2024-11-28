"use client"
import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, DatePicker, Input, InputNumber, message } from 'antd'
import moment from 'moment'

export default function ReservationManager() {
  const [reservations, setReservations] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [form] = Form.useForm()

  // Charger les réservations
  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservation')
      const data = await response.json()
      console.log("RESERVATIONSSSSSSSSSSSSS",data);
      setReservations(data)
    } catch (error) {
      message.error('Erreur lors du chargement des réservations')
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  // Gérer la création/modification
  const handleSubmit = async (values) => {
    try {
      const url = editingReservation 
        ? `/api/reservation?id=${editingReservation._id}`
        : '/api/reservation'
      
      const method = editingReservation ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          from: values.from.toDate(),
          to: values.to.toDate(),
        }),
      })

      if (response.ok) {
        message.success(`Réservation ${editingReservation ? 'modifiée' : 'créée'} avec succès`)
        setIsModalVisible(false)
        fetchReservations()
        form.resetFields()
      }
    } catch (error) {
      message.error('Une erreur est survenue')
    }
  }

  // Supprimer une réservation
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/reservation?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        message.success('Réservation supprimée avec succès')
        fetchReservations()
      }
    } catch (error) {
      message.error('Erreur lors de la suppression')
    }
  }

  const columns = [
    { title: 'Nom', dataIndex: 'names', key: 'names' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Téléphone', dataIndex: 'phone_number', key: 'phone_number' },
    { 
      title: 'Date début', 
      dataIndex: 'from', 
      key: 'from',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    { 
      title: 'Date fin', 
      dataIndex: 'to', 
      key: 'to',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    { title: 'Participants', dataIndex: 'participants', key: 'participants' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button 
            type="primary" 
            onClick={() => {
              setEditingReservation(record)
              form.setFieldsValue({
                ...record,
                from: moment(record.from),
                to: moment(record.to),
              })
              setIsModalVisible(true)
            }}
            style={{ marginRight: 8 }}
          >
            Modifier
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Supprimer
          </Button>
        </>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Réservations</h1>
        <Button 
          type="primary" 
          onClick={() => {
            setEditingReservation(null)
            form.resetFields()
            setIsModalVisible(true)
          }}
        >
          Nouvelle Réservation
        </Button>
      </div>

      <Table columns={columns} dataSource={reservations} rowKey="_id" />

      <Modal
        title={editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item name="names" label="Nom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Téléphone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="from" label="Date début" rules={[{ required: true }]}>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
          <Form.Item name="to" label="Date fin" rules={[{ required: true }]}>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
          <Form.Item name="participants" label="Participants" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="message" label="Message">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingReservation ? 'Modifier' : 'Créer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
