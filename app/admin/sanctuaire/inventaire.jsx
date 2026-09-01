"use client"
import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, AppstoreOutlined, AlertOutlined, DollarCircleOutlined, AudioOutlined } from '@ant-design/icons';
import VoiceDictationModal from './VoiceDictationModal';

const { Option } = Select;

const defaultMockItems = [
  {
    _id: "demo_1",
    nom: "Chaises empilables VIP (Salle d'accueil)",
    categorie: "mobilier",
    quantite: 50,
    etat: "bon",
    localisation: "Grande Salle d'Accueil",
    prix_acquisition: 15000,
    notes: "Chaises en PVC tressé résistant avec accoudoirs"
  },
  {
    _id: "demo_2",
    nom: "Tondeuse à gazon thermique Honda",
    categorie: "jardinage",
    quantite: 2,
    etat: "bon",
    localisation: "Garage & Espaces Verts",
    prix_acquisition: 350000,
    notes: "Moteur 4 temps, révisée en Juillet 2026"
  },
  {
    _id: "demo_3",
    nom: "Groupe électrogène Caterpillar 15 kVA",
    categorie: "electricite",
    quantite: 1,
    etat: "a_reparer",
    localisation: "Local Technique Général",
    prix_acquisition: 2500000,
    notes: "Souci d'alternateur, pièces commandées"
  },
  {
    _id: "demo_4",
    nom: "Climatiseurs Split Inverter 2.5 CV",
    categorie: "electricite",
    quantite: 8,
    etat: "bon",
    localisation: "Pavillon des Pères & Secrétariat",
    prix_acquisition: 280000,
    notes: "Marque Samsung Eco-Inverter"
  },
  {
    _id: "demo_5",
    nom: "Matelas Mousse Haute Densité (2 places)",
    categorie: "literie",
    quantite: 40,
    etat: "usage",
    localisation: "Dortoirs Pèlerins A & B",
    prix_acquisition: 45000,
    notes: "Housses lavables intégrées"
  },
  {
    _id: "demo_6",
    nom: "Fourneau à gaz professionnel 4 feux",
    categorie: "cuisine",
    quantite: 2,
    etat: "bon",
    localisation: "Grande Cuisine Communautaire",
    prix_acquisition: 450000,
    notes: "Inox alimentaire avec four à convecteur"
  },
  {
    _id: "demo_7",
    nom: "Autel en bois massif sculpté",
    categorie: "liturgique",
    quantite: 1,
    etat: "neuf",
    localisation: "Chapelle Principale Notre-Dame",
    prix_acquisition: 850000,
    notes: "Bois d'iroko sculpté à la main"
  },
  {
    _id: "demo_8",
    nom: "Système de Sonorisation (Enceintes + Micro HF)",
    categorie: "informatique",
    quantite: 1,
    etat: "bon",
    localisation: "Espace de Prière Extérieur",
    prix_acquisition: 650000,
    notes: "2 enceintes amplifiées Yamaha + table de mixage"
  },
  {
    _id: "demo_9",
    nom: "Extincteurs à poudre ABC 6kg",
    categorie: "securite",
    quantite: 12,
    etat: "neuf",
    localisation: "Couloirs, Cuisine & Dortoirs",
    prix_acquisition: 35000,
    notes: "Contrôle annuel valide jusqu'en 2027"
  },
  {
    _id: "demo_10",
    nom: "Pompe immergée de forage eau potable",
    categorie: "plomberie",
    quantite: 1,
    etat: "hors_service",
    localisation: "Puits de Forage Est",
    prix_acquisition: 420000,
    notes: "Moteur grillé suite surtension"
  }
];

export default function InventaireManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [etatFilter, setEtatFilter] = useState('all');
  const [form] = Form.useForm();

  const handleVoiceParsed = (parsedData) => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue(parsedData);
    setIsModalVisible(true);
  };

  const fetchInventaire = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventaire');
      const data = await res.json();
      setItems(Array.isArray(data) && data.length > 0 ? data : defaultMockItems);
    } catch (err) {
      console.error(err);
      setItems(defaultMockItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventaire();
  }, []);

  const metrics = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + (item.quantite || 1), 0);
    const toRepair = items.filter(item => item.etat === 'a_reparer' || item.etat === 'hors_service').length;
    const totalValue = items.reduce((sum, item) => sum + ((item.prix_acquisition || 0) * (item.quantite || 1)), 0);

    return { totalItems, toRepair, totalValue, count: items.length };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !searchText || item.nom.toLowerCase().includes(searchText.toLowerCase()) || 
        (item.localisation && item.localisation.toLowerCase().includes(searchText.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || item.categorie === categoryFilter;
      const matchesEtat = etatFilter === 'all' || item.etat === etatFilter;
      return matchesSearch && matchesCategory && matchesEtat;
    });
  }, [items, searchText, categoryFilter, etatFilter]);

  const handleOpenModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue({
        ...record,
        prix_acquisition: record.prix_acquisition || 0
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ quantite: 1, etat: 'bon', categorie: 'mobilier' });
    }
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/inventaire?id=${editingItem._id}` : '/api/inventaire';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (res.ok) {
        message.success(`Équipement ${editingItem ? 'modifié' : 'ajouté'} avec succès`);
        setIsModalVisible(false);
        fetchInventaire();
      } else {
        message.error('Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      console.error(err);
      message.error('Erreur serveur');
    }
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: 'Supprimer l\'équipement ?',
      content: `Voulez-vous vraiment supprimer "${record.nom}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          const res = await fetch(`/api/inventaire?id=${record._id}`, { method: 'DELETE' });
          if (res.ok) {
            message.success('Équipement supprimé');
            fetchInventaire();
          }
        } catch (err) {
          message.error('Erreur lors de la suppression');
        }
      }
    });
  };

  const getEtatBadge = (etat) => {
    switch (etat) {
      case 'neuf': return <span className="spec05-badge spec05-badge--neuf">✨ Neuf</span>;
      case 'bon': return <span className="spec05-badge spec05-badge--bon">🟢 Bon état</span>;
      case 'usage': return <span className="spec05-badge spec05-badge--usage">🟡 Usagé</span>;
      case 'a_reparer': return <span className="spec05-badge spec05-badge--reparer">⚠️ À réparer</span>;
      case 'hors_service': return <span className="spec05-badge spec05-badge--hors">🔴 Hors service</span>;
      default: return <span className="spec05-badge">{etat}</span>;
    }
  };

  const getCategoryLabel = (cat) => {
    const icons = {
      mobilier: '🪑',
      cuisine: '🍳',
      jardinage: '🌱',
      electricite: '⚡',
      plomberie: '🚰',
      literie: '🛏️',
      nettoyage: '🧹',
      liturgique: '🕯️',
      securite: '🛡️',
      informatique: '💻',
      autre: '📦'
    };
    return `${icons[cat] || '📦'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
  };

  const columns = [
    {
      title: 'Désignation',
      dataIndex: 'nom',
      key: 'nom',
      render: (text, record) => (
        <div className="spec05-item-cell">
          <span className="item-title">{text}</span>
          {record.notes && <span className="item-subtitle">{record.notes}</span>}
        </div>
      )
    },
    {
      title: 'Catégorie',
      dataIndex: 'categorie',
      key: 'categorie',
      render: (cat) => <span className="spec05-category-pill">{getCategoryLabel(cat)}</span>
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
      align: 'center',
      render: (qte) => <span className="spec05-quantity-pill">{qte} unit.</span>
    },
    {
      title: 'État matériel',
      dataIndex: 'etat',
      key: 'etat',
      render: (etat) => getEtatBadge(etat)
    },
    {
      title: 'Localisation',
      dataIndex: 'localisation',
      key: 'localisation',
      render: (loc) => (
        <span className="spec05-location-tag">
          📍 {loc || 'Non spécifiée'}
        </span>
      )
    },
    {
      title: 'Prix unit. estimé',
      dataIndex: 'prix_acquisition',
      key: 'prix_acquisition',
      align: 'right',
      render: (prix) => prix ? (
        <span className="spec05-amount">{prix.toLocaleString('fr-FR')} FCFA</span>
      ) : <span className="spec05-amount-null">—</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button className="spec05-action-btn spec05-action-btn--edit" icon={<EditOutlined />} size="small" onClick={() => handleOpenModal(record)} />
          <Button className="spec05-action-btn spec05-action-btn--delete" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)} />
        </Space>
      )
    }
  ];

  return (
    <div className="spec05-container">
      {/* En-tête de section */}
      <div className="spec05-header">
        <div>
          <h2 className="spec05-title">📦 Inventaire du Matériel & Équipements</h2>
          <p className="spec05-subtitle">Gestion centralisée du parc mobilier, électrique, liturgique et logistique du Sanctuaire</p>
        </div>
        <Space size="middle">
          <Button 
            className="spec05-voice-btn" 
            size="large" 
            icon={<AudioOutlined />} 
            onClick={() => setIsVoiceModalVisible(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}
          >
            🎙️ Dictée Vocale IA
          </Button>

          <Button type="primary" size="large" className="spec05-add-btn" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            Nouveau Matériel
          </Button>
        </Space>
      </div>

      {/* Cartes KPI Glassmorphism 2026 */}
      <div className="spec05-kpi-grid">
        <div className="spec05-kpi-card spec05-kpi-card--blue">
          <div className="kpi-icon"><AppstoreOutlined /></div>
          <div className="kpi-body">
            <span className="kpi-label">Volume Total Équipements</span>
            <span className="kpi-value">{metrics.totalItems} <small>unités</small></span>
            <span className="kpi-sub">{metrics.count} références enregistrées</span>
          </div>
        </div>

        <div className="spec05-kpi-card spec05-kpi-card--amber">
          <div className="kpi-icon"><AlertOutlined /></div>
          <div className="kpi-body">
            <span className="kpi-label">Maintenance / À Réparer</span>
            <span className="kpi-value">{metrics.toRepair} <small>équipements</small></span>
            <span className="kpi-sub">Anomalies nécessitant intervention</span>
          </div>
        </div>

        <div className="spec05-kpi-card spec05-kpi-card--emerald">
          <div className="kpi-icon"><DollarCircleOutlined /></div>
          <div className="kpi-body">
            <span className="kpi-label">Valeur Totale du Parc</span>
            <span className="kpi-value">{metrics.totalValue.toLocaleString('fr-FR')} <small>FCFA</small></span>
            <span className="kpi-sub">Estimation valeur globale</span>
          </div>
        </div>
      </div>

      {/* Barre de recherche & filtres */}
      <div className="spec05-toolbar">
        <div className="toolbar-left">
          <Input 
            placeholder="Rechercher par désignation ou pièce..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="spec05-search-input"
            allowClear
          />

          <Select value={categoryFilter} onChange={setCategoryFilter} className="spec05-select">
            <Option value="all">📁 Toutes catégories</Option>
            <Option value="mobilier">🪑 Mobilier</Option>
            <Option value="cuisine">🍳 Cuisine</Option>
            <Option value="jardinage">🌱 Jardinage</Option>
            <Option value="electricite">⚡ Électricité</Option>
            <Option value="plomberie">🚰 Plomberie</Option>
            <Option value="literie">🛏️ Literie</Option>
            <Option value="nettoyage">🧹 Nettoyage</Option>
            <Option value="liturgique">🕯️ Liturgique</Option>
            <Option value="securite">🛡️ Sécurité</Option>
            <Option value="informatique">💻 Informatique</Option>
            <Option value="autre">📦 Autre</Option>
          </Select>

          <Select value={etatFilter} onChange={setEtatFilter} className="spec05-select">
            <Option value="all">🔍 Tous les états</Option>
            <Option value="neuf">✨ Neuf</Option>
            <Option value="bon">🟢 Bon état</Option>
            <Option value="usage">🟡 Usagé</Option>
            <Option value="a_reparer">⚠️ À réparer</Option>
            <Option value="hors_service">🔴 Hors service</Option>
          </Select>
        </div>
      </div>

      {/* Tableau Stylisé */}
      <div className="spec05-table-wrapper">
        <Table 
          columns={columns} 
          dataSource={filteredItems} 
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          className="spec05-custom-table"
        />
      </div>

      {/* Modal Création / Édition */}
      <Modal
        title={<div className="spec05-modal-title">{editingItem ? "✏️ Modifier l'équipement" : "➕ Ajouter un nouvel équipement"}</div>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Enregistrer les modifications"
        cancelText="Annuler"
        className="spec05-modal"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="spec05-form">
          <Form.Item name="nom" label="Nom / Désignation du matériel" rules={[{ required: true, message: 'Champ obligatoire' }]}>
            <Input placeholder="Ex: Chaises d'accueil VIP, Groupe Électrogène 10kVA..." />
          </Form.Item>
          
          <div className="form-row">
            <Form.Item name="categorie" label="Catégorie" rules={[{ required: true }]}>
              <Select>
                <Option value="mobilier">🪑 Mobilier</Option>
                <Option value="cuisine">🍳 Cuisine</Option>
                <Option value="jardinage">🌱 Jardinage</Option>
                <Option value="electricite">⚡ Électricité</Option>
                <Option value="plomberie">🚰 Plomberie</Option>
                <Option value="literie">🛏️ Literie</Option>
                <Option value="nettoyage">🧹 Nettoyage</Option>
                <Option value="liturgique">🕯️ Liturgique</Option>
                <Option value="securite">🛡️ Sécurité</Option>
                <Option value="informatique">💻 Informatique</Option>
                <Option value="autre">📦 Autre</Option>
              </Select>
            </Form.Item>

            <Form.Item name="quantite" label="Quantité" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item name="etat" label="État de conservation" rules={[{ required: true }]}>
              <Select>
                <Option value="neuf">✨ Neuf</Option>
                <Option value="bon">🟢 Bon état</Option>
                <Option value="usage">🟡 Usagé</Option>
                <Option value="a_reparer">⚠️ À réparer</Option>
                <Option value="hors_service">🔴 Hors service</Option>
              </Select>
            </Form.Item>

            <Form.Item name="localisation" label="Localisation / Emplacement">
              <Input placeholder="Ex: Dortoir A, Salle de réunion..." />
            </Form.Item>
          </div>

          <Form.Item name="prix_acquisition" label="Prix d'acquisition unitaire (FCFA)">
            <InputNumber min={0} step={5000} style={{ width: '100%' }} placeholder="Ex: 25000" />
          </Form.Item>

          <Form.Item name="notes" label="Notes / Détails complémentaires">
            <Input.TextArea rows={3} placeholder="Précisez la marque, la date ou les références si nécessaire..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de dictée vocale IA */}
      <VoiceDictationModal 
        open={isVoiceModalVisible}
        onCancel={() => setIsVoiceModalVisible(false)}
        onParsed={handleVoiceParsed}
        mode="inventaire"
      />
    </div>
  );
}
