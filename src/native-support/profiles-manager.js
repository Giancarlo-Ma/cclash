import { promisify } from 'util'
import { readdir } from 'fs'
import path from 'path'

import { getDataPath, fetchHttp } from './utils'
import { getCurrentConfig } from './configs-manager'

const BASE_URL = 'http://localhost:2390'
const readDir = promisify(readdir)

export async function fetchProfiles() {
	const folderName = path.resolve(getDataPath(), 'clash-configs')
	const folderContents = await readDir(folderName);

	const profiles = folderContents
		.filter(each => each.endsWith('.yaml') || each.endsWith('yml'))
		.map(each => {
			const fullPath = path.resolve(path.join(folderName, each))
			return {
				name: each,
				url: fullPath,
			}
		})
	const { currentProfile } = getCurrentConfig()
	return {
		profiles,
		currentProfile
	}
}

export async function switchToCurrentProfile() {
	const { currentProfile, currentSelector, currentProxy } = getCurrentConfig()
	await fetchHttp(`${BASE_URL}/configs`, 'PUT', {
			path: currentProfile
	})
	const body = {
			name: currentProxy,
			'log-level': 'warning'
	}
	return await fetchHttp(`${BASE_URL}/proxies/${currentSelector}`, 'PUT', body)
}