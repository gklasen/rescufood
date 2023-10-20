const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
	.then(createWindowsInstaller)
	.catch((error) => {
		console.error(error.message || error)
		process.exit(1)
	})

	function getInstallerConfig () {
		console.log('creating windows installer')
		const rootPath = path.join('./')
		const outPath = path.join(rootPath, 'release-builds')

		return Promise.resolve({
			appDirectory: path.join(outPath, 'Rescufood-win32-ia32/'),
			authors: 'Gerrit Klasen',
			noMsi: true,
			outputDirectory: path.join(outPath, 'windows-installer'),
			exe: 'Rescufood.exe',
			setupExe: 'RescufoodInstaller.exe',
			setupIcon: path.join(rootPath, 'resources',  'icon.ico')
		})
}