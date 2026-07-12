const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async getWaterBalance() {
    const res = await fetch(`${API_URL}/water-balance/latest`);
    return res.json();
  },

  async saveWaterBalance(data: any) {
    const res = await fetch(`${API_URL}/water-balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getWaterQuality() {
    const res = await fetch(`${API_URL}/water-quality/latest`);
    return res.json();
  },

  async saveWaterQuality(data: any) {
    const res = await fetch(`${API_URL}/water-quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getCoolingTower() {
    const res = await fetch(`${API_URL}/cooling-tower/latest`);
    return res.json();
  },

  async saveCoolingTower(data: any) {
    const res = await fetch(`${API_URL}/cooling-tower`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getNeutrality() {
    const res = await fetch(`${API_URL}/neutrality/latest`);
    return res.json();
  },

  async saveNeutrality(data: any) {
    const res = await fetch(`${API_URL}/neutrality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getKPIs() {
    const res = await fetch(`${API_URL}/kpis/latest`);
    return res.json();
  },

  async saveKPI(data: any) {
    const res = await fetch(`${API_URL}/kpis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
