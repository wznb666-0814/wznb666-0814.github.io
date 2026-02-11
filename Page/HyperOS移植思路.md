---
title: HyperOS移植思路(5.15及以上)
published: 2026-01-17
description: '快速进行你的HyperOS移植'
image: ''
tags: [ROM移植]
category: 'ROM移植'
draft: false 
lang: 'ZH-CN'
---
# Xiaomi HyperOS 移植思路  

# 免责声明  
:::note[提示1]
本教程所有步骤和操作均由作者实践过后予以发布，不存在损害你的设备的操作，如果你未按照本文教程操作导致的任何损失均于作者无关  
作者只是一个初三在校生，技术不是最突出的，玩机和制作ROM & 插件纯属本人爱好，如果你不喜欢请不要喷我  
:::
:::note[提示2]
本教程只在教程如何开包，未加入任何ROM个性化内容  
个性化内容请看“HyperOS移植思路——BUG修复与个性化修改篇”帖  
:::

---
# 正式开始  

---
## 下载ROM  
首先，你需要准备两个刷机包（卡刷包）  
第一个包是你的设备的ROM包（之后统称为“底包”）  
第二个包是你要移植的目标机型的ROM包（之后称之为“目标包”）  
ROM下载站（其他的也行，只要能下载到ROM文件即可）：https://hyperos.fans/  

---
## 解压ROM  
下载完成后，用MT管理器打开压缩包  
找到一个名为“payload.bin”的文件  
在里面找到以下几个文件：  
```
mi-ext  
product  
system  
system_ext  
odm  
system_dikm  
vendor  
vendor_dikm  
```
把它们全部解压出来，放到一个文件夹里（两个包全部这样做）  
:::note[⚠️注意]
两个包的文件不要混淆，搞错会导致ROM制作失败甚至是设备变砖！  
:::

---
## 分解img镜像  
打开DNA-Android工具  
新建一个工程  
进入项目   
点击“工程菜单”  
二级菜单下找到“分解img”  
先把你解压出来的底包的8个镜像文件移动到 
```
/DNA/DNA_移植工程/  
```
目录下  
回到DNA-Android工具  
点击“分解img”  
选择那8个镜像文件，勾选“删除源文件”  
点确定  
分解完成后打开MT管理器，回根目录下，找到
```
/data/DNA/DNA_移植工程/  
```
里面应该有8个文件夹，分别是  
```
mi-ext  
product  
system  
system_ext  
odm  
system_dikm  
vendor  
vendor_dikm  
```
有的话这一步就成功了，没有自己再检查一下

---
## 提取底包文件
保持上一步的目录下，先进入product文件夹
复制几个文件备份，分别是
```
/product/etc/device_features/xxx.xml (xxx代表你的底包机型代号，每个机子都不同)  
/product/etc/displayconfig/display_id_xxx.xml (这里的xxx是数字，每个机子都不同)  
/product/overlay/AospFrameworkResOverlay.apk  
/product/overlay/DevicesAndroidOverlay.apk  
/product/overlay/DevicesOverlay.apk  
/product/overlay/MiuiFrameworkResOverlay.apk  
/product/overlay/MiuiFrameworkTelephonyResOverlay.apk  
/product/pangu 文件夹整体  
```
返回上一级目录  
进入system_ext文件夹  
复制几个文件备份，分别是
```
/system_ext/apex 文件夹整体  
/system_ext/etc/vintf/manifest.xml
```
这里对于底包的文件提取就完成了  
保证以上提到的文件备份好，这8个文件夹就可以删除了  

---
## 解压目标包  
根据上面的“分解img镜像”步骤，解压目标包的8个镜像文件  
再次进入到“提取底包文件”步骤内的目录下  

---
## 替换文件  
进入product文件夹，把你从底包复制出来的文件一一替换，确保没有遗漏  
进入system_ext文件夹，把目标包的文件替换掉底包的文件，确保没有遗漏  

---
:::note[⚠️注意]
到这里对于ROM的基本移植工作就结束了，你可以进行打包测试，如果还是开不了机，那就可能遇到了几个不能开机的BUG，具体修复教程请移步“HyperOS移植思路——BUG修复与个性化修改篇”帖  
:::