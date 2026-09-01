"use client"
import { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, DollarOutlined, AudioOutlined } from '@ant-design/icons';
import VoiceDictationModal from './VoiceDictationModal';

const { Option } = Select;

const defaultMockEntretiens = [
  {
    _id: "demo_ent_1",
    titre: "Dépannage & Vidange Groupe Électrogène 15 kVA",
    categorie: "entretien",
    priorite: "urgente",
    statut: "en_cours",
    description: "Diagnostic de l'alternateur, remplacement des filtres à huile et à carburant",
    cout_estime: 180000,
    cout_reel: 0,
    responsable: "M. Gaston",
    fournisseur: "Ets Élec-Abidjan",
    notes: "Intervention en cours depuis lundi"
  },
  {
    _id: "demo_ent_2",
    titre: "Réparation de la fuite de toiture Dortoir B",
    categorie: "reparation",
    priorite: "haute",
    statut: "planifie",
    description: "Remplacement de 15 tôles ondulées endommagées par les récentes intempéries",
    cout_estime: 250000,
    cout_reel: 0,
    responsable: "P. Gilbert",
    fournisseur: "SODEBAT CI",
    notes: "Chantier prévu le week-end prochain"
  },
  {
    _id: "demo_ent_3",
    titre: "Remplacement de la pompe de forage eau potable",
    categorie: "reparation",
    priorite: "urgente",
    statut: "en_cours",
    description: "Achat et installation d'une nouvelle pompe immergée 2.2kW avec coffret de protection électrique",
    cout_estime: 450000,
    cout_reel: 420000,
    responsable: "M. Gaston",
    fournisseur: "Hydro-Service Adzopé",
    notes: "Livraison de la pompe prévue sous 24h"
  },
  {
    _id: "demo_ent_4",
    titre: "Rénovation & Peinture de la Chapelle Notre-Dame",
    categorie: "renovation",
    priorite: "normale",
    statut: "termine",
    description: "Nettoyage des façades intérieures/extérieures et application de 2 couches de peinture acrylique",
    cout_estime: 600000,
    cout_reel: 580000,
    responsable: "P. Gilbert",
    fournisseur: "Déco Peinture CI",
    notes: "Travaux terminés avec succès pour la fête patronale"
  },
  {
    _id: "demo_ent_5",
    titre: "Recharge & Révision des 12 Extincteurs du Sanctuaire",
    categorie: "entretien",
    priorite: "normale",
    statut: "termine",
    description: "Vérification annuelle de la pression et renouvellement de la poudre extinctrice ABC",
    cout_estime: 120000,
    cout_reel: 120000,
    responsable: "M. Gaston",
    fournisseur: "SécuriFeu CI",
    notes: "Vignettes de conformité apposées"
  }
];

export default function EntretienManager() {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [editingEntretien, setEditingEntretien] = useState(null);
  const [statutFilter, setStatutFilter] = useState('all');
  const [prioriteFilter, setPrioriteFilter] = useState('all');
  const [form] = Form.useForm();

  const handleVoiceParsed = (parsedData) => {
    setEditingEntretien(null);
    form.resetFields();
    form.setFieldsValue(parsedData);
    setIsModalVisible(true);
  };

  const fetchEntretiens = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/entretien');
      const data = await res.json();
      setEntretiens(Array.isArray(data) && data.length > 0 ? data : defaultMockEntretiens);
    } catch (err) {
      console.error(err);
      setEntretiens(defaultMockEntretiens);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntretiens();
  }, []);

  const metrics = useMemo(() => {
    const totalCount = entretiens.length;
    const inProgress = entretiens.filter(e => e.statut === 'en_cours').length;
    const urgentCount = entretiens.filter(e => e.priorite === 'urgente' && e.statut !== 'termine').length;
    const totalEstimated = entretiens.reduce((sum, e) => sum + (e.cout_estime || 0), 0);
    const totalReal = entretiens.reduce((sum, e) => sum + (e.cout_reel || 0), 0);

    return { totalCount, inProgress, urgentCount, totalEstimated, totalReal };
  }, [entretiens]);

  const filteredEntretiens = useMemo(() => {
    return entretiens.filter(e => {
      const matchesStatut = statutFilter === 'all' || e.statut === statutFilter;
      const matchesPriorite = prioriteFilter === 'all' || e.priorite === prioriteFilter;
      return matchesStatut && matchesPriorite;
    });
  }, [entretiens, statutFilter, prioriteFilter]);

  const handleOpenModal = (record = null) => {
    setEditingEntretien(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({
        categorie: 'entretien',
        priorite: 'normale',
        statut: 'planifie',
        cout_estime: 0,
        cout_reel: 0
      });
    }
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      const method = editingEntretien ? 'PUT' : 'POST';
      const url = editingEntretien ? `/api/entretien?id=${editingEntretien._id}` : '/api/entretien';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (res.ok) {
        message.success(`Fiche d'entretien ${editingEntretien ? 'modifiée' : 'créée'} avec succès`);
        setIsModalVisible(false);
        fetchEntretiens();
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
      title: 'Supprimer la fiche d\'entretien ?',
      content: `Voulez-vous supprimer "${record.titre}" ?`,
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          const res = await fetch(`/api/entretien?id=${record._id}`, { method: 'DELETE' });
          if (res.ok) {
            message.success('Entretien supprimé');
            fetchEntretiens();
          }
        } catch (err) {
          message.error('Erreur lors de la suppression');
        }
      }
    });
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'planifie': return <span className="spec05-badge spec05-badge--planified">📅 Planifié</span>;
      case 'en_cours': return <span className="spec05-badge spec05-badge--progress">⚙️ En cours</span>;
      case 'termine': return <span className="spec05-badge spec05-badge--done">✅ Terminé</span>;
      case 'annule': return <span className="spec05-badge spec05-badge--canceled">❌ Annulé</span>;
      default: return <span className="spec05-badge">{statut}</span>;
    }
  };

  const getPrioriteBadge = (prio) => {
    switch (prio) {
      case 'urgente': return <span className="spec05-badge spec05-badge--urgent">⚡ URGENT</span>;
      case 'haute': return <span className="spec05-badge spec05-badge--haute">🔴 Haute</span>;
      case 'normale': return <span className="spec05-badge spec05-badge--normale">🔵 Normale</span>;
      case 'basse': return <span className="spec05-badge spec05-badge--basse">⚪ Basse</span>;
      default: return <span className="spec05-badge">{prio}</span>;
    }
  };

  const columns = [
    {
      title: 'Titre & Objet du chantier',
      dataIndex: 'titre',
      key: 'titre',
      render: (text, record) => (
        <div className="spec05-item-cell">
          <span className="item-title">{text}</span>
          <span className="item-subtitle">{record.description}</span>
        </div>
      )
    },
    {
      title: 'Priorité',
      dataIndex: 'priorite',
      key: 'priorite',
      render: (prio) => getPrioriteBadge(prio)
    },
    {
      title: 'Statut avancement',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => getStatutBadge(statut)
    },
    {
      title: 'Intervenants / Prestataire',
      dataIndex: 'responsable',
      key: 'responsable',
      render: (resp, record) => (
        <div className="spec05-contact-cell">
          {resp && <span className="resp-person">👤 {resp}</span>}
          {record.fournisseur && <span className="resp-vendor">🏢 {record.fournisseur}</span>}
          {!resp && !record.fournisseur && <span className="resp-none">—</span>}
        </div>
      )
    },
    {
      title: 'Devis Estimé',
      dataIndex: 'cout_estime',
      key: 'cout_estime',
      align: 'right',
      render: (cout) => cout ? <span className="spec05-amount">{cout.toLocaleString('fr-FR')} FCFA</span> : '—'
    },
    {
      title: 'Coût Réel Réglé',
      dataIndex: 'cout_reel',
      key: 'cout_reel',
      align: 'right',
      render: (cout) => cout ? <span className="spec05-amount spec05-amount--success">{cout.toLocaleString('fr-FR')} FCFA</span> : '—'
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
          <h2 className="spec05-title">🔧 Suivi des Entretiens, Réparations & Travaux</h2>
          <p className="spec05-subtitle">Planning des interventions techniques, chantiers de rénovation et devis budgétaires</p>
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
            Nouveau Devis / Intervenant
          </Button>
        </Space>
      </div>

      {/* Cartes KPI Glassmorphism 2026 */}
      <div className="spec05-kpi-grid">
        <div className="spec05-kpi-card spec05-kpi-card--blue">
          <div className="kpi-icon"><ToolOutlined /></div>
          <div className="kpi-body">
            <span className="kpi-label">Fiches de Travaux</span>
            <span className="kpi-value">{metrics.totalCount} <small>dossiers</small></span>
            <span className="kpi-sub">{metrics.inProgress} intervention(s) en cours</span>
          </div>
        </div>

        <div className="spec05-kpi-card spec05-kpi-card--amber">
          <div className="kpi-icon"><ClockCircleOutlined /></div>
          <div className="kpi-body">
            <span className="kpi-label">Devis Totaux Estimés</span>
            <span className="kpi-value">{metrics.totalEstimated.toLocaleString('fr-FR')} <small>FCFA</small></span>
            <span className="kpi-sub">Budget travaux prévisionnel</span>
          </div>
        </div>

        <div className="spec05-kpi-card spec05-kpi-card--emerald">
          <div className="kpi-icon"><DollarOutlined /></div>
          <div className="kpi-body">
            <span className="kpi-label">Coût Réel Facturé</span>
            <span className="kpi-value">{metrics.totalReal.toLocaleString('fr-FR')} <small>FCFA</small></span>
            <span className="kpi-sub">Dépenses réelles acquittées</span>
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="spec05-toolbar">
        <div className="toolbar-left">
          <Select value={statutFilter} onChange={setStatutFilter} className="spec05-select">
            <Option value="all">🔍 Tous les statuts</Option>
            <Option value="planifie">📅 Planifié</Option>
            <Option value="en_cours">⚙️ En cours</Option>
            <Option value="termine">✅ Terminé</Option>
            <Option value="annule">❌ Annulé</Option>
          </Select>

          <Select value={prioriteFilter} onChange={setPrioriteFilter} className="spec05-select">
            <Option value="all">⚡ Toutes priorités</Option>
            <Option value="urgente">⚡ URGENT</Option>
            <Option value="haute">🔴 Haute</Option>
            <Option value="normale">🔵 Normale</Option>
            <Option value="basse">⚪ Basse</Option>
          </Select>
        </div>
      </div>

      {/* Tableau Stylisé */}
      <div className="spec05-table-wrapper">
        <Table 
          columns={columns} 
          dataSource={filteredEntretiens} 
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          className="spec05-custom-table"
        />
      </div>

      {/* Modal Création / Édition */}
      <Modal
        title={<div className="spec05-modal-title">{editingEntretien ? "✏️ Modifier la fiche travaux" : "➕ Créer un nouveau devis / travaux"}</div>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Enregistrer la fiche"
        cancelText="Annuler"
        className="spec05-modal"
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="spec05-form">
          <Form.Item name="titre" label="Objet de l'intervention / chantier" rules={[{ required: true, message: 'Champ obligatoire' }]}>
            <Input placeholder="Ex: Réparation Groupe Électrogène, Remplacement toiture dortoir B..." />
          </Form.Item>

          <div className="form-row form-row--3">
            <Form.Item name="categorie" label="Catégorie" rules={[{ required: true }]}>
              <Select>
                <Option value="reparation">🛠️ Réparation</Option>
                <Option value="entretien">🧹 Entretien</Option>
                <Option value="renovation">🎨 Rénovation</Option>
                <Option value="achat">🛒 Achat matériel</Option>
                <Option value="construction">🏗️ Construction</Option>
                <Option value="autre">📦 Autre</Option>
              </Select>
            </Form.Item>

            <Form.Item name="priorite" label="Niveau de priorité" rules={[{ required: true }]}>
              <Select>
                <Option value="basse">⚪ Basse</Option>
                <Option value="normale">🔵 Normale</Option>
                <Option value="haute">🔴 Haute</Option>
                <Option value="urgente">⚡ URGENT</Option>
              </Select>
            </Form.Item>

            <Form.Item name="statut" label="Statut travaux" rules={[{ required: true }]}>
              <Select>
                <Option value="planifie">📅 Planifié</Option>
                <Option value="en_cours">⚙️ En cours</Option>
                <Option value="termine">✅ Terminé</Option>
                <Option value="annule">❌ Annulé</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description détaillée des travaux" rules={[{ required: true, message: 'Champ obligatoire' }]}>
            <Input.TextArea rows={3} placeholder="Précisez le périmètre des travaux, l'origine de la panne ou le devis..." />
          </Form.Item>

          <div className="form-row">
            <Form.Item name="cout_estime" label="Devis Estimé (FCFA)">
              <InputNumber min={0} step={5000} style={{ width: '100%' }} placeholder="Ex: 150000" />
            </Form.Item>

            <Form.Item name="cout_reel" label="Coût Réel Facturé (FCFA)">
              <InputNumber min={0} step={5000} style={{ width: '100%' }} placeholder="Ex: 145000" />
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item name="responsable" label="Responsable du suivi (interne)">
              <Input placeholder="Ex: P. Gilbert, Gaston..." />
            </Form.Item>

            <Form.Item name="fournisseur" label="Artisan / Entreprise (prestataire)">
              <Input placeholder="Ex: Ets Koné Plomberie..." />
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Notes additionnelles">
            <Input.TextArea rows={2} placeholder="Numéro de facture, garantie ou commentaires..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de dictée vocale IA */}
      <VoiceDictationModal 
        open={isVoiceModalVisible}
        onCancel={() => setIsVoiceModalVisible(false)}
        onParsed={handleVoiceParsed}
        mode="entretien"
      />
    </div>
  );
}
