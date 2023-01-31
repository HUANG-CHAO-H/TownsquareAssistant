// @ts-ignore
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const distDir = path.resolve(rootDir, 'dist');

// 如果不存在dist文件夹, 就创建一个
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// 生成 manifest.json文件并写入到dist文件夹;
const _manifest = require('./script/manifest');
fs.writeFileSync(path.resolve(distDir, 'manifest.json'), JSON.stringify(_manifest));

// 生成 document_start.js 文件并写入到dist文件夹(在页面加载前就注入页面)
const document_start = require('./script/document_start');
const startScript = `
${document_start.toString()}
console.info('document_start 阶段');
document_start();
`;
fs.writeFileSync(path.resolve(distDir, 'document_start.js'), startScript);

// 生成 document_idle.js 文件并写入到dist文件夹(在页面加载前就注入页面)
const document_idle = require('./script/document_idle');
const idleScript = `
${document_idle.toString()}
console.info('document_idle 阶段');
document_idle();
`;
fs.writeFileSync(path.resolve(distDir, 'document_idle.js'), idleScript);

// 生成 document_idle.js 文件并写入到dist文件夹(在页面加载前就注入页面)
const document_end = require('./script/document_end');
const endScript = `
${document_end.toString()}
console.info('document_end 阶段');
document_end();
`;
fs.writeFileSync(path.resolve(distDir, 'document_end.js'), endScript);

// 复制静态资源文件
copyFile(path.resolve(__dirname, 'assets'), path.resolve(distDir, 'assets'));
copyFile(path.resolve(__dirname, 'json'), path.resolve(distDir, 'json'));

function copyFile(sourcePath: string, targetPath: string) {
    const status = fs.statSync(sourcePath);
    if (status.isFile()) {
        fs.copyFileSync(sourcePath, targetPath, fs.constants.COPYFILE_FICLONE);
        return;
    }
    // 如果存在, 就删了重建, 保证是空文件夹
    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, {
            force: true,
            recursive: true,
        })
    }
    fs.mkdirSync(targetPath);

    // 读取目录下的文件，返回文件名及文件类型{name: 'xxx.txt, [Symbol(type)]: 1 }
    const files = fs.readdirSync(sourcePath, { withFileTypes: true });
    for (const file of files) {
        const srcFile = path.resolve(sourcePath, file.name);
        const tagFile = path.resolve(targetPath, file.name);
        if (file.isDirectory()) {
            fs.mkdirSync(tagFile);
            copyFile(srcFile, tagFile);
        } else {
            fs.copyFileSync(srcFile, tagFile, fs.constants.COPYFILE_FICLONE);
        }
    }
}
// function deleteFile(filePath: string) {
//     const status = fs.statSync(filePath);
//     if (status.isFile()) {
//         fs.rmSync(filePath);
//         return;
//     }
//     // 读取该文件夹下面的所有文件
//     const files = fs.readdirSync(filePath, { withFileTypes: true });
//     for (const file of files) {
//         if (file.isDirectory()) {
//             deleteFile(path.resolve(filePath, file.name));
//         } else {
//             fs.rmSync(filePath);
//         }
//     }
//     fs.rmdirSync(filePath);
// }
