import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment, Float, Lightformer, RoundedBox, Sparkles } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'

type Props = {
  lightsOn: boolean
  onToggle: () => void
  glowTarget: RefObject<HTMLElement | null>
  reducedMotion: boolean
}

const CORD = 3.4
const WARM = new THREE.Color('#ffc56b')

function glowTexture() {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,214,140,1)')
  grad.addColorStop(0.25, 'rgba(255,190,100,0.45)')
  grad.addColorStop(1, 'rgba(255,170,80,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function bulbGeometry() {
  const pts = [
    [0.2, 0],
    [0.22, -0.12],
    [0.27, -0.26],
    [0.4, -0.45],
    [0.52, -0.66],
    [0.56, -0.88],
    [0.52, -1.08],
    [0.4, -1.24],
    [0.22, -1.33],
    [0, -1.36],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  return new THREE.LatheGeometry(pts, 48)
}

function Bulb({ lightsOn, onToggle, glowTarget, reducedMotion }: Props) {
  const { viewport, camera, size, gl } = useThree()
  const pivot = useRef<THREE.Group>(null)
  const bulbCenter = useRef<THREE.Object3D>(null)
  const light = useRef<THREE.PointLight>(null)
  const glow = useRef<THREE.Sprite>(null)
  const glass = useRef<THREE.MeshPhysicalMaterial>(null)
  const filament = useRef<THREE.MeshStandardMaterial>(null)

  const geo = useMemo(bulbGeometry, [])
  const tex = useMemo(glowTexture, [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])

  const narrow = size.width < 760
  // on phones the bulb hangs smaller, in the empty band above the copy
  const scale = narrow ? 0.48 : 1
  const length = CORD * scale
  const anchor = useMemo(() => {
    if (!narrow) return new THREE.Vector3(viewport.width * 0.2, viewport.height / 2 + 1.1, 0)
    const bulbY = viewport.height / 2 - (185 / size.height) * viewport.height
    return new THREE.Vector3(viewport.width * 0.22, bulbY + (CORD + 0.95) * scale, 0)
  }, [narrow, viewport.width, viewport.height, size.height, scale])

  const sim = useRef({ a: size.width < 760 ? 0.2 : 0.5, v: 0, b: 0, bv: 0, dragging: false, pulled: false, travel: 0, last: new THREE.Vector3() })
  const level = useRef(lightsOn ? 1 : 0)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    gl.domElement.style.cursor = hover ? (sim.current.dragging ? 'grabbing' : 'grab') : ''
  }, [hover, gl])

  const pointOnPlane = (e: ThreeEvent<PointerEvent> | PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect()
    const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    const ray = new THREE.Raycaster()
    ray.setFromCamera(ndc, camera)
    const p = new THREE.Vector3()
    ray.ray.intersectPlane(plane, p)
    return p
  }

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const s = sim.current
      if (!s.dragging) return
      const p = pointOnPlane(e)
      s.travel += p.distanceTo(s.last)
      s.last.copy(p)
      const dx = p.x - anchor.x
      const dy = anchor.y - p.y
      const target = THREE.MathUtils.clamp(Math.atan2(dx, dy), -1.3, 1.3)
      s.v = (target - s.a) * 30
      s.a = target
      s.pulled = Math.hypot(dx, dy) > length + 1.8 * scale
    }
    const up = () => {
      const s = sim.current
      if (!s.dragging) return
      s.dragging = false
      document.body.style.cursor = ''
      if (s.pulled || s.travel < 0.08) onToggle()
      s.pulled = false
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  })

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const s = sim.current
    s.dragging = true
    s.travel = 0
    s.last.copy(pointOnPlane(e))
    document.body.style.cursor = 'grabbing'
  }

  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const s = sim.current
    const d = Math.min(dt, 1 / 30)
    const t = state.clock.elapsedTime
    if (!s.dragging) {
      const wind = reducedMotion ? 0 : Math.sin(t * 0.7) * 0.05
      s.v += (-(9.8 / CORD) * Math.sin(s.a) + wind - s.v * 0.35) * d
      s.a += s.v * d
    }
    s.bv += (-(9.8 / CORD) * Math.sin(s.b) + (reducedMotion ? 0 : Math.cos(t * 0.5) * 0.03) - s.bv * 0.5) * d
    s.b += s.bv * d

    if (pivot.current) {
      pivot.current.position.copy(anchor)
      pivot.current.rotation.set(s.b, 0, s.a)
      pivot.current.scale.setScalar(scale)
    }

    level.current = THREE.MathUtils.damp(level.current, lightsOn ? 1 : 0, 6, d)
    const k = level.current
    const flicker = reducedMotion ? 1 : 1 + Math.sin(t * 13) * 0.015 + Math.sin(t * 29) * 0.01
    if (light.current) light.current.intensity = k * 38 * flicker
    if (glow.current) {
      glow.current.material.opacity = k * 0.95
      const sc = 3.6 + k * 0.6
      glow.current.scale.set(sc, sc, 1)
    }
    if (glass.current) {
      glass.current.emissiveIntensity = k * 1.4 * flicker
      glass.current.transmission = 1 - k * 0.55
      glass.current.roughness = 0.05 + k * 0.3
    }
    if (filament.current) filament.current.emissiveIntensity = 0.05 + k * 6

    const el = glowTarget.current
    if (el && bulbCenter.current) {
      bulbCenter.current.getWorldPosition(tmp)
      tmp.project(camera)
      const canvasRect = gl.domElement.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const x = canvasRect.left + ((tmp.x + 1) / 2) * canvasRect.width - r.left
      const y = canvasRect.top + ((1 - tmp.y) / 2) * canvasRect.height - r.top
      el.style.setProperty('--bx', `${x.toFixed(1)}px`)
      el.style.setProperty('--by', `${y.toFixed(1)}px`)
      el.style.setProperty('--glow', k.toFixed(3))
    }
  })

  return (
    <group ref={pivot}>
      {/* cord */}
      <mesh position={[0, -CORD / 2, 0]}>
        <cylinderGeometry args={[0.018, 0.018, CORD, 8]} />
        <meshStandardMaterial color="#2a2b45" roughness={0.6} />
      </mesh>
      <group
        position={[0, -CORD, 0]}
        onPointerDown={onDown}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {/* socket */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.34, 32]} />
          <meshStandardMaterial color="#b9b6cf" metalness={0.9} roughness={0.28} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -0.05 - i * 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.215, 0.018, 8, 32]} />
            <meshStandardMaterial color="#d7d3ea" metalness={0.9} roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.09, 0.12, 0.12, 16]} />
          <meshStandardMaterial color="#2a2b45" roughness={0.5} />
        </mesh>
        {/* glass */}
        <mesh geometry={geo} position={[0, -0.24, 0]}>
          <meshPhysicalMaterial
            ref={glass}
            color="#fff6e3"
            emissive={WARM}
            transmission={1}
            thickness={0.35}
            ior={1.45}
            roughness={0.05}
            clearcoat={1}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* filament */}
        <group position={[0, -0.95, 0]} ref={bulbCenter}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.1, 0.012, 8, 24, Math.PI]} />
            <meshStandardMaterial ref={filament} color="#ffdca0" emissive={WARM} />
          </mesh>
          <mesh position={[-0.05, 0.3, 0]} rotation={[0, 0, 0.18]}>
            <cylinderGeometry args={[0.006, 0.006, 0.55, 6]} />
            <meshStandardMaterial color="#8a86a8" />
          </mesh>
          <mesh position={[0.05, 0.3, 0]} rotation={[0, 0, -0.18]}>
            <cylinderGeometry args={[0.006, 0.006, 0.55, 6]} />
            <meshStandardMaterial color="#8a86a8" />
          </mesh>
          <pointLight ref={light} color={WARM} distance={14} decay={1.6} />
          <sprite ref={glow}>
            <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
        {/* generous invisible grab area */}
        <mesh position={[0, -0.7, 0]} visible={false}>
          <sphereGeometry args={[0.9, 12, 12]} />
        </mesh>
      </group>
    </group>
  )
}

type ToyProps = {
  position: [number, number, number]
  color: string
  kind: 'pill' | 'donut' | 'star' | 'cube' | 'ball' | 'gem'
  scale?: number
  reducedMotion: boolean
}

function starShape() {
  const s = new THREE.Shape()
  const spikes = 5
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 0.5 : 0.24
    const a = (i / (spikes * 2)) * Math.PI * 2 + Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) s.moveTo(x, y)
    else s.lineTo(x, y)
  }
  s.closePath()
  return s
}

function Toy({ position, color, kind, scale = 1, reducedMotion }: ToyProps) {
  const ref = useRef<THREE.Group>(null)
  const spring = useRef({ s: 1, sv: 0, spin: 0 })
  const star = useMemo(() => (kind === 'star' ? starShape() : null), [kind])

  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const sp = spring.current
    sp.sv += (-(sp.s - 1) * 180 - sp.sv * 10) * dt
    sp.s += sp.sv * dt
    sp.spin *= 1 - Math.min(1, dt * 2.2)
    g.rotation.y += sp.spin * dt
    g.scale.setScalar(scale * sp.s)
  })

  const boop = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    spring.current.sv += 9
    spring.current.spin += 14
  }

  const mat = <meshPhysicalMaterial color={color} roughness={0.32} clearcoat={1} clearcoatRoughness={0.15} sheen={0.4} />

  return (
    <Float speed={reducedMotion ? 0 : 1.4} rotationIntensity={reducedMotion ? 0 : 0.9} floatIntensity={reducedMotion ? 0 : 1.2}>
      <group
        ref={ref}
        position={position}
        onClick={boop}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        {kind === 'pill' && (
          <mesh rotation={[0, 0, 0.7]}>
            <capsuleGeometry args={[0.22, 0.5, 8, 24]} />
            {mat}
          </mesh>
        )}
        {kind === 'donut' && (
          <mesh rotation={[1, 0.3, 0]}>
            <torusGeometry args={[0.32, 0.14, 24, 48]} />
            {mat}
          </mesh>
        )}
        {kind === 'star' && star && (
          <mesh>
            <extrudeGeometry args={[star, { depth: 0.18, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4 }]} />
            {mat}
          </mesh>
        )}
        {kind === 'cube' && (
          <RoundedBox args={[0.55, 0.55, 0.55]} radius={0.14} smoothness={4} rotation={[0.5, 0.6, 0]}>
            {mat}
          </RoundedBox>
        )}
        {kind === 'ball' && (
          <mesh>
            <sphereGeometry args={[0.28, 32, 32]} />
            {mat}
          </mesh>
        )}
        {kind === 'gem' && (
          <mesh rotation={[0.3, 0.4, 0]}>
            <icosahedronGeometry args={[0.3, 0]} />
            <meshPhysicalMaterial color={color} roughness={0.15} clearcoat={1} flatShading />
          </mesh>
        )}
      </group>
    </Float>
  )
}

function Toys({ reducedMotion }: { reducedMotion: boolean }) {
  const { viewport, size } = useThree()
  const group = useRef<THREE.Group>(null)
  const narrow = size.width < 760
  const w = viewport.width / 2
  const h = viewport.height / 2

  useFrame((state, dt) => {
    if (!group.current || reducedMotion) return
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.12, 3, dt)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.08, 3, dt)
  })

  const band = (px: number) => h - (px / size.height) * h * 2
  const items: Omit<ToyProps, 'reducedMotion'>[] = narrow
    ? [
        { position: [-w * 0.72, band(210), -0.5], color: '#9ea8ff', kind: 'pill', scale: 0.55 },
        { position: [-w * 0.25, band(115), -1], color: '#ffc56b', kind: 'star', scale: 0.42 },
        { position: [w * 0.85, band(255), -1], color: '#c8ec8e', kind: 'donut', scale: 0.5 },
      ]
    : [
        { position: [w * 0.52, h * 0.45, -0.5], color: '#9ea8ff', kind: 'pill' },
        { position: [w * 0.85, -h * 0.05, -1], color: '#c8ec8e', kind: 'donut' },
        { position: [w * 0.45, -h * 0.8, -0.8], color: '#ffc56b', kind: 'star', scale: 0.85 },
        { position: [w * 0.72, -h * 0.68, -0.6], color: '#d9dcff', kind: 'cube' },
        { position: [-w * 0.12, h * 0.75, -2], color: '#c8ec8e', kind: 'ball', scale: 0.8 },
        { position: [w * 0.95, h * 0.7, -1.5], color: '#ffc56b', kind: 'gem' },
        { position: [w * 0.08, h * 0.35, -2.5], color: '#9ea8ff', kind: 'ball', scale: 0.6 },
      ]

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Toy key={i} {...it} reducedMotion={reducedMotion} />
      ))}
    </group>
  )
}

export default function BulbScene(props: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="scene" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={props.lightsOn ? 0.35 : 0.9} />
        <directionalLight position={[-4, 5, 5]} intensity={props.lightsOn ? 0.5 : 1.6} color={props.lightsOn ? '#9ea8ff' : '#ffffff'} />
        <Environment resolution={128}>
          <Lightformer intensity={2} position={[0, 4, -4]} scale={[10, 2, 1]} color="#c9cdfd" />
          <Lightformer intensity={1.2} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 6, 1]} color="#ffffff" />
          <Lightformer intensity={1} position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 6, 1]} color="#ffe2b0" />
        </Environment>
        <Sparkles
          count={props.reducedMotion ? 0 : 45}
          scale={[12, 7, 3]}
          size={2.4}
          speed={0.25}
          opacity={props.lightsOn ? 0.8 : 0.35}
          color={props.lightsOn ? '#ffe0a3' : '#7d86e0'}
        />
        <Toys reducedMotion={props.reducedMotion} />
        <Bulb {...props} />
      </Canvas>
    </div>
  )
}
