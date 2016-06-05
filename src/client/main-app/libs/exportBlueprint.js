import request from 'superagent'
import JSZip from 'JSZip'
import saveAs from 'saveAs'

import requests from '../requests/requests'

export default function(blueprint) {
  const zip = new JSZip()

  const promises = []
  const javascripts = [
    'three.min.js',
    'PointerLockControls.js',
    'ThreeCSG.min.js',
    'snap.svg-min.js'
  ]
  const images = [
    'wall-texture.jpg',
    'posx.jpg',
    'negx.jpg',
    'posy.jpg',
    'negy.jpg',
    'posz.jpg',
    'negz.jpg',
    'floor-texture.jpg'
  ]

  promises.push(...javascripts.map((filename) => {
    return new Promise((resolve, reject) => {
      request.get(`/javascripts/${filename}`)
      .then((res, err) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.text)
        }
      })
    })
  }))

  promises.push(...images.map((filename) => {
    return new Promise((resolve, reject) => {
      request.get(`/images/${filename}`)
      .then((res, err) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.text)
        }
      })
    })
  }))

  promises.push(requests.fetchSvgFragment(blueprint))

  return Promise.all(promises)
  .then((files) => {
    const jsFolder = zip.folder('javascripts')
    for (let i = 0; i < javascripts.length; i++) {
      jsFolder.file(javascripts[i], files[i])
    }
    const imgFolder = zip.folder('images')
    for (let i = 0; i < images.length; i++) {
      imgFolder.file(images[i], files[i + javascripts.length])
    }

    zip.file(
      'index.html',
      `<!DOCTYPE html>
    <html lang="zh-cmn-Hans">
      <head>
        <meta charSet="UTF-8">
        <meta httpEquiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="renderer" content="webkit">
        <title>图样</title>
        <style>
          html, body {
            width: 100%;
            height: 100%;
          }
          body {
            margin: 0;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script src="javascripts/three.min.js"></script>
        <script src="javascripts/PointerLockControls.js"></script>
        <script src="javascripts/ThreeCSG.min.js"></script>
        <script src="javascripts/snap.svg-min.js"></script>
        <script>
          var svgObj = null
          var wallMaterial = null
          var scene = new THREE.Scene()
          var renderer = null
          var camera = null
          var skybox = null
          var floor = null
          var move = null
          var svgContent = ${files[files.length - 1].toString()}

          function createLineGeo(svgElem, config) {
            var scale = config.scale
            var depth = config.depth
            var height = config.height
            var heightOffsetGround = config.heightOffsetGround
            var offsetX = config.offsetX
            var offsetY = config.offsetY
            var x1 = Number(svgElem.attr('x1')) / scale
            var y1 = Number(svgElem.attr('y1')) / scale
            var x2 = Number(svgElem.attr('x2')) / scale
            var y2 = Number(svgElem.attr('y2')) / scale
            // center point
            var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) + depth

            var theta = 0
            if (x1 === x2) {
              theta = 0.5 * Math.PI // It's pretty weird because we can not use 90 deg directly.
            } else {
              theta = -Math.atan((y1 - y2) / (x1 - x2))
            }
            var localX = (x1 + x2) / 2 + offsetX / scale
            var localZ = (y1 + y2) / 2 + offsetY / scale
            var localY = height / 2 + (heightOffsetGround || 0)

            // var material = new THREE.MeshPhongMaterial({ color: 0xffffff })
            var lineGeo = new THREE.BoxGeometry(length, height, depth)
            lineGeo.rotateY(theta)
            lineGeo.translate(localX, localY, localZ)

            return lineGeo
          }

          function draw(config) {
            var material = wallMaterial
            var scale = config.scale
            var wallHeight = config.wallHeight
            var wallDepth = config.wallDepth
            var doorHeight = config.doorHeight
            var windowHeight = config.windowHeight
            var windowOffsetGround = config.windowOffsetGround
            var offsetX = 100
            var offsetY = 100

            // var wallGeo = new THREE.Geometry()
            svgObj.selectAll('.wall').forEach(function(wallElem, idx) {
              var wallGeo = createLineGeo(wallElem, {
                depth: wallDepth,
                height: wallHeight,
                scale: scale,
                offsetX: offsetX,
                offsetY: offsetY
              })

              var wallBSP = new ThreeBSP(wallGeo)

              var windowOrDoorIds = wallElem.data('hoveredLineIds')
              if (windowOrDoorIds) {
                windowOrDoorIds.forEach(function(id) {
                  var elem = svgObj.select('#' + id)
                  if (!elem) {
                    return
                  }
                  if (elem.attr('class') === 'window') {
                    var windowGeo = createLineGeo(elem, {
                      depth: wallDepth,
                      height: windowHeight,
                      heightOffsetGround: windowOffsetGround,
                      scale: scale,
                      offsetX: offsetX,
                      offsetY: offsetY
                    })
                    var windowBSP = new ThreeBSP(windowGeo)
                    wallBSP = wallBSP.subtract(windowBSP)
                  } else if (elem.attr('class') === 'door') {
                    var doorGeo = createLineGeo(elem, {
                      depth: wallDepth,
                      height: doorHeight,
                      scale: scale,
                      offsetX: offsetX,
                      offsetY: offsetY
                    })
                    var doorBSP = new ThreeBSP(doorGeo)
                    wallBSP = wallBSP.subtract(doorBSP)
                  }
                })
              }

              var wallMesh = wallBSP.toMesh(material)
              scene.add(wallMesh)
            })
          }

          function loadMaterials() {
            var loader = new THREE.TextureLoader()
            var bumpTexture = loader.load('images/wall-texture.jpg')
            bumpTexture.wrapS = THREE.RepeatWrapping
            bumpTexture.wrapT = THREE.RepeatWrapping
            bumpTexture.repeat.set(3, 3)
            wallMaterial = new THREE.MeshPhongMaterial({ bumpMap: bumpTexture, bumpScale: 0.1 })
          }

          function initMoveControl(camera) {
            var control = new THREE.PointerLockControls(camera)
            control.getObject().position.z = 30
            control.getObject().showCameraVisible = true
            var canJump = true
            var state = {
              forward: false,
              left: false,
              backward: false,
              right: false
            }
            var velocity = new THREE.Vector3()
            var clock = new THREE.Clock()

            function __onKeyDown(event) {
              switch (event.keyCode) {
                case 38: // up
                case 87: // w
                  state.forward = true
                  break
                case 37: // left
                case 65: // a
                  state.left = true
                  break
                case 40: // down
                case 83: // s
                  state.backward = true
                  break
                case 39: // right
                case 68: // d
                  state.right = true
                  break
                case 32: // space
                  if (canJump === true) {
                    velocity.y += 250
                  }
                  canJump = false
                  break
              }
            }

            function __onKeyUp(event) {
              switch (event.keyCode) {
                case 38: // up
                case 87: // w
                  state.forward = false
                  break
                case 37: // left
                case 65: // a
                  state.left = false
                  break
                case 40: // down
                case 83: // s
                  state.backward = false
                  break
                case 39: // right
                case 68: // d
                  state.right = false
                  break
              }
            }

            move = function() {
              if (!control.enabled) {
                console.warn('Failed to move, controls are disabled,')
                return
              }

              var forward = state.forward
              var right = state.right
              var backward = state.backward
              var left = state.left
              var delta = clock.getDelta()

              velocity.x -= velocity.x * 10.0 * delta
              velocity.z -= velocity.z * 10.0 * delta
              velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass

              if (forward) {
                velocity.z -= 400.0 * delta
              }
              if (backward) {
                velocity.z += 400.0 * delta
              }
              if (left) {
                velocity.x -= 400.0 * delta
              }
              if (right) {
                velocity.x += 400.0 * delta
              }

              control.getObject().translateX(velocity.x * delta)
              control.getObject().translateY(velocity.y * delta)
              control.getObject().translateZ(velocity.z * delta)

              var height = 17
              if (control.getObject().position.y < height) {
                velocity.y = 0
                control.getObject().position.y = height
                canJump = true
              }
            }

            control.enabled = true
            scene.add(control.getObject())
            document.addEventListener('keydown', this.__onKeyDown, false)
            document.addEventListener('keyup', this.__onKeyUp, false)
          }

          function initScene() {
            // Renderer
            renderer = new THREE.WebGLRenderer()
            renderer.setClearColor(new THREE.Color(0xffffff, 1.0))
            renderer.shadowMap.enabled = false

            // Camera
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000)
            camera.position.set(0, 0, 10)
            camera.lookAt(new THREE.Vector3(0, 0, 0))

            // Light
            var ambiColor = '#0c0c0c'
            var ambientLight = new THREE.AmbientLight(ambiColor)
            scene.add(ambientLight)

            var dirColor = '#ffffff'
            var dirIntensity = 0.3
            var directionalLight = new THREE.DirectionalLight(dirColor, dirIntensity)
            directionalLight.position.set(-1, 1, -0.2)
            scene.add(directionalLight)
            // scene.add(new THREE.DirectionalLightHelper(directionalLight, 100))
            var directionalLight2 = new THREE.DirectionalLight(dirColor, 0.05)
            directionalLight2.position.set(0.2, 0, 0.8)
            scene.add(directionalLight2)
            var directionalLight3 = new THREE.DirectionalLight(dirColor, 0.05)
            directionalLight3.position.set(0.3, 0, 0.2)
            scene.add(directionalLight3)

            var hemiLight = new THREE.HemisphereLight(0xf2e9e1, 0x9b9b9b, 0.8)
            hemiLight.position.set(-200, 500, -50)
            scene.add(hemiLight)

            // Skybox
            var size = 2000
            var loader = new THREE.CubeTextureLoader()
            loader.setPath('images/')
            var textureCube = loader.load([
              'posx.jpg',
              'negx.jpg',
              'posy.jpg',
              'negy.jpg',
              'posz.jpg',
              'negz.jpg'
            ])

            var shader = THREE.ShaderLib['cube']
            shader.uniforms['tCube'].value = textureCube
            var material = new THREE.ShaderMaterial({
              fragmentShader: shader.fragmentShader,
              vertexShader: shader.vertexShader,
              uniforms: shader.uniforms,
              depthWrite: false,
              side: THREE.BackSide
            })
            skybox = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), material)
            scene.add(skybox)

            // Floor
            var size = 500
            var floorGeo = new THREE.PlaneGeometry(size, size)
            var floorLoader = new THREE.TextureLoader()
            var texture = floorLoader.load('images/floor-texture.jpg')
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(30, 30)
            var floorMat = new THREE.MeshLambertMaterial({ map: texture })
            floor = new THREE.Mesh(floorGeo, floorMat)
            floor.rotation.x = -0.5 * Math.PI
            scene.add(floor)
          }

          function initSvg() {
            // svgObj = Snap(0, 0).add(Snap.parse(svgContent))
            svgObj = Snap.parse(svgContent)
            svgObj.selectAll('.window').forEach(function(_window) {
              // Don't forget to restore hoveredLineIds because three canvas need it to render correctly.
              var hoverWallId = _window.attr('hover-elem-id')
              var hoverWall = svgObj.select('#' + hoverWallId)
              if (hoverWall) {
                var hoveredLineIds = hoverWall.data('hoveredLineIds') || []
                hoveredLineIds.push(_window.attr('id'))
                hoverWall.data('hoveredLineIds', hoveredLineIds)
              }
            })
            svgObj.selectAll('.door').forEach(function(door) {
              var hoverWallId = door.attr('hover-elem-id')
              var hoverWall = svgObj.select('#' + hoverWallId)
              if (hoverWall) {
                var hoveredLineIds = hoverWall.data('hoveredLineIds') || []
                hoveredLineIds.push(door.attr('id'))
                hoverWall.data('hoveredLineIds', hoveredLineIds)
              }
            })

            var config = {
              scale: 10,
              planeSize: 100,
              wallDepth: 1,
              wallHeight: 35,
              windowHeight: 15,
              windowOffsetGround: 10,
              doorHeight: 23
            }
            var configKeys = {
              scale: 'scale',
              planeSize: 'plane-size',
              wallDepth: 'wall-depth',
              wallHeight: 'wall-height',
              windowHeight: 'window-height',
              windowOffsetGround: 'window-offset-ground',
              doorHeight: 'door-height',
            };
            var meta = svgObj.select('blueprint-meta')
            if (meta) {
              Object.keys(configKeys).forEach(function(key) {
                if (meta.attr(configKeys[key])) {
                  config[key] = Number(meta.attr(configKeys[key]))
                }
              })
            }
            draw(config)
          }

          function initPointerLock() {
            function pointerlockchange() {
              var inPointerLock = (
                (document.pointerLockElement === element) ||
                (document.mozPointerLockElement === element) ||
                (document.msPointerLockElement === element) ||
                (document.webkitPointerLockElement === element)
              )
              console.log('Pointer Lock succeed')
              render()
            }
            function pointerlockerror(e) {
              console.error('Pointer Lock failed.', e)
            }
            // Hook pointer lock state change events
            document.addEventListener('pointerlockchange', pointerlockchange, false)
            document.addEventListener('mozpointerlockchange', pointerlockchange, false)
            document.addEventListener('mspointerlockchange', pointerlockchange, false)
            document.addEventListener('webkitpointerlockchange', pointerlockchange, false)

            document.addEventListener('pointerlockerror', pointerlockerror, false)
            document.addEventListener('mozpointerlockerror', pointerlockerror, false)
            document.addEventListener('mspointerlockerror', pointerlockerror, false)
            document.addEventListener('webkitpointerlockerror', pointerlockerror, false)

            // Ask the browser to lock the pointer
            var element = document.body
            element.requestPointerLock = (
              element.requestPointerLock ||
              element.mozRequestPointerLock ||
              element.msRequestPointerLock ||
              element.webkitRequestPointerLock
            )
            var isPointerLockAvailable = (
              ('pointerLockElement' in document) ||
              ('mozPointerLockElement' in document) ||
              ('webkitPointerLockElement' in document)
            )
            if (isPointerLockAvailable) {
              element.requestPointerLock()
            } else {
              console.error('Pointer Lock not supported!')
            }
          }

          function render() {
            renderer.setSize(window.innerWidth, window.innerHeight)
            document.body.appendChild(renderer.domElement)
            requestAnimationFrame(function _render() {
              move()
              renderer.render(scene, camera)
              requestAnimationFrame(_render)
            })
          }

          loadMaterials()
          initScene()
          initMoveControl(camera)
          initSvg()
          initPointerLock()
        </script>
      </body>
    </html>`
      )

    return zip.generateAsync({ type: 'blob' })
    .then((blob) => {
      saveAs(blob, `${blueprint.name}.zip`)
    })
  })
}
