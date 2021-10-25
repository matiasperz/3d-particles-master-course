import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// This allows to clone a mesh shape but creating new vertices randomly
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import { BufferAttribute, BufferGeometry } from 'three'
import vertexShader from './shader/vertexShader.glsl'
import fragmentShader from './shader/fragmentShader.glsl'

class Model {
  constructor (obj) {
    this.name = obj.name
    this.file = obj.file
    this.scene = obj.scene
    this.placeOnLoad = obj.placeOnLoad
    
    this.color1 = obj.color1
    this.color2 = obj.color2

    this.loader = new GLTFLoader()
    this.dragoLoader = new DRACOLoader()
    this.dragoLoader.setDecoderPath('./draco/')
    this.loader.setDRACOLoader(this.dragoLoader)

    this.init()
  }

  init() {
    this.loader.load(this.file, (res) => {
      /* Original Mesh */
      this.mesh = res.scene.children[0]

      /* Material Mesh */
      this.material = new THREE.MeshBasicMaterial({color: 'red', wireframe: true})
      this.mesh.material = this.material

      /* Geometry Mesh */
      this.geometry = this.mesh.geometry

      /* Particles Material */
      // this.particlesMaterial = new THREE.PointsMaterial({
      //   color: 'red',
      //   size: 0.02
      // })
      this.particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color(this.color1) },
          uColor2: { value: new THREE.Color(this.color2) }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false, // Improves perf
        depthWrite: false, // Improves perf
        blending: THREE.AdditiveBlending
      })

      /* Particles Geometry */
      const sampler = new MeshSurfaceSampler(this.mesh).build()
      const numParticles = 20000
      this.particlesGeometry = new THREE.BufferGeometry()
      const particlesPosition = new Float32Array(numParticles * 3)

      for(let i = 0; i < numParticles; i++) {
        const i3 = i * 3

        const newPosition = new THREE.Vector3()
        sampler.sample(newPosition)
        particlesPosition.set([
          newPosition.x,
          newPosition.y,
          newPosition.z
        ], i3)
      }

      this.particlesGeometry.setAttribute('position', new BufferAttribute(particlesPosition, 3))

      /* Particles */
      this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

      if(this.placeOnLoad) {
        this.add()
      }
    })
  }

  add() {
    this.scene.add(this.particles)
  }

  remove() {
    this.scene.remove(this.particles)
  }
}

export default Model
