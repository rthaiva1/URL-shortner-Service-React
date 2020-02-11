'use strict';

const axios = require('axios');

function Shortener(wsUrl) {
  this.wsUrl = getWsUrl();
}

module.exports = Shortener;

Shortener.prototype.translate = async function(text) {
  try {
    const url = `${this.wsUrl}/x-text`;
    const response = await axios.post(url, { text, isHtml: true });
    return response.data.value;
  }
  catch (err) {
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

Shortener.prototype.subst = async function(text) {
  try {
    const url = `${this.wsUrl}/x-subst`;
    const response = await axios.post(url, { text });
    return response.data.value;
  }
  catch (err) {
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

Shortener.prototype.info = async function(url) {
  try {
    const response = await axios.get(`${this.wsUrl}/x-url?url=${url}`);
    return response.data;
  }
  catch (err) {
    throw (err.response && err.response.data) ? err.response.data : err;
  }  
};

Shortener.prototype.deactivate = async function(url) {
  try {
    const response = await axios.delete(`${this.wsUrl}/x-url?url=${url}`);
    return response.data;
  }
  catch (err) {
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};


const DEFAULT_WS_URL = 'http://zdu.binghamton.edu:2345';

function getWsUrl() {
  const params = (new URL(document.location)).searchParams;
  return params.get('ws-url') || DEFAULT_WS_URL;
}
