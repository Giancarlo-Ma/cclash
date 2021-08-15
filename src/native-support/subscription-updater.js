import { join } from 'path';
import * as fs from 'fs';
import { getDataPath } from './utils';
import { createSubscriptionFileIfNeeded } from './configs-manager'
import { MALFORM_URL, NOT_SUPPORTED_PROTOCOL } from '../errorMessage'
import { emptySubscriptions } from './defaultFileContent'
import { fetchHttps, fetchHttp } from './utils';

async function getSavedSubscriptions() {
  createSubscriptionFileIfNeeded();
  const file = join(getDataPath(), 'clashy-configs', 'subscriptions.json');
  const content = fs.readFileSync(file, 'utf8')
  if (content == null || content.length === 0) {
    fs.writeFileSync(file, JSON.stringify(emptySubscriptions))
    return Promise.resolve({
      ...emptySubscriptions
    })
  }
  try {
    return JSON.parse(content)
  } catch (e) {
    fs.writeFileSync(file, JSON.stringify(emptySubscriptions))
    return Promise.resolve({
      ...emptySubscriptions
    })
  }
}

export async function addSubscription(url) {
  if (url == null || url.length === 0) {
    return Promise.reject(new Error(MALFORM_URL))
  }
  const parsedUrl = new URL(url)
  const name = parsedUrl.host + (parsedUrl.pathname == null ? '' : parsedUrl.pathname.replace(/\//g, '_'))
  const fileName = join(getDataPath(), 'clash-configs', `${name}.yml`)
  const exist = fs.existsSync(fileName);
  if(!exist) {
    let resp = null
    if (parsedUrl.protocol === 'https:') {
      resp = await fetchHttps(url)
    } else if (parsedUrl.protocol === 'http:') {
      resp = await fetchHttp(url, 'GET')
    } else return Promise.reject(new Error(NOT_SUPPORTED_PROTOCOL))
    console.log(typeof resp)
    fs.writeFileSync(fileName, resp)
    await _addSubscriptions([{
      fileName,
      url
    }])
  }
}

export async function deleteSubscription(fileName) {
  if (fileName == null || fileName.length === 0) {
    return Promise.resolve()
  }
  const currentSubscription = await getSavedSubscriptions()
  const idx = (currentSubscription.subscriptions || []).findIndex((each) => {
    return each.fileName === fileName
  })
  if (idx >= 0) {
    const del = currentSubscription.subscriptions.splice(idx, 1)[0]
    fs.unlinkSync(del.fileName)
  }
  _saveSubscriptions(currentSubscription)
}

function _saveSubscriptions(subscriptions) {
  const filePath = join(getDataPath(), 'clashy-configs', 'subscriptions.json')
  fs.writeFileSync(filePath, JSON.stringify(subscriptions))
}

async function _addSubscriptions(subscriptions) {
  const current = await getSavedSubscriptions()
  subscriptions.forEach(sub => {
    const idx = (current.subscriptions || []).findIndex(subscription => subscription.fileName === sub.fileName);
    console.log(idx)
    if(idx >= 0) current.subscriptions[idx].url =  sub.url
    else current.subscriptions = (current.subscriptions || []).concat([sub])
  })
  console.log(current)
  _saveSubscriptions(current)
}