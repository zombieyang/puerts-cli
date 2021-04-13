/*
* Tencent is pleased to support the open source community by making Puerts available.
* Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
* Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
* This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
*
* This file is copyied from npm-find-prefix
*/


'use strict'
// try to find the most reasonable prefix to use

module.exports = findPrefix

const fs = require('fs')
const path = require('path')

function findPrefix (dir) {
  return new Promise((resolve, reject) => {
    dir = path.resolve(dir)

    // this is a weird special case where an infinite recurse of
    // node_modules folders resolves to the level that contains the
    // very first node_modules folder
    let walkedUp = false
    while (path.basename(dir) === 'node_modules') {
      dir = path.dirname(dir)
      walkedUp = true
    }
    if (walkedUp) {
      resolve(dir)
    } else {
      resolve(findPrefix_(dir))
    }
  })
}

function findPrefix_ (dir, original) {
  if (!original) original = dir

  const parent = path.dirname(dir)
  // this is a platform independent way of checking if we're in the root
  // directory
  if (parent === dir) return Promise.resolve('')

  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        // an error right away is a bad sign.
        // unless the prefix was simply a non
        // existent directory.
        if (err && dir === original && err.code !== 'ENOENT') {
          reject(err)
        } else {
          resolve(original)
        }
      } else if (files.indexOf('node_modules') !== -1 ||
                 files.indexOf('package.json') !== -1) {
        resolve(dir)
      } else {
        resolve(findPrefix_(parent, original))
      }
    })
  })
}
