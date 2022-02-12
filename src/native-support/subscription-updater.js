import { join } from 'path';
import * as fs from 'fs';
import { getDataPath } from './utils';
import { createSubscriptionFileIfNeeded } from './configs-manager'
import { MALFORM_URL } from '../errorMessage'
import { emptySubscriptions } from './defaultFileContent'
import { download } from './utils';

async function getSavedSubscriptions() {
  createSubscriptionFileIfNeeded();
  const file = join(getDataPath(), 'clashy-configs', 'subscriptions.json');
  console.log(file)
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

export async function addProfile(e, url) {
  if (url == null || url.length === 0) {
    return Promise.reject(new Error(MALFORM_URL))
  }
  const parsedUrl = new URL(url)
  const name = parsedUrl.host + (parsedUrl.pathname == null ? '' : parsedUrl.pathname.replace(/\//g, '_'))
  const fileName = join(getDataPath(), 'clash-configs', `${name}.yml`)
  const exist = fs.existsSync(fileName);
  if(!exist) {
    await download(url, fileName)
    await _addSubscriptions([{
      fileName,
      url
    }])
  }
}

export async function deleteProfile(e, fileName) {
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

export async function reloadProfile(e, fileName) {
  if (fileName == null || fileName.length === 0) {
      return Promise.resolve()
  }
  const saved = await getSavedSubscriptions()
  const target = (saved.subscriptions || []).find(each => {
      return each.fileName === fileName
  })
  const url = target.url

  // Purge current config content
  const fd = await openFile(fileName, 'w+')
  await writeFile(fd, '')
  await closeFile(fd)

  await download(url, fileName)
}