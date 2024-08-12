import type { PointerEvent } from 'react'
import { useEffect, useState } from 'react'
import styles from './indexPage.module.scss'

type Tap = {
	id: number
	x: number
	y: number
}

export function IndexPage() {
	const [score, setScore] = useState(1000000)
	const [energy, setEnergy] = useState(100)
	const [autoMode, setAutoMode] = useState(false)
	const [taps, setTaps] = useState<Tap[]>([])

	function handleClick(e: PointerEvent<HTMLButtonElement>) {
		if (energy < 1) {
			return
		}

		setTaps((t) => [...t, { id: score, x: e.clientX, y: e.clientY }])
		setScore((s) => s + 1)
		setEnergy((e) => e - 1)
	}

	function removeTap(id: number) {
		setTaps((taps) => taps.filter((t) => t.id !== id))
	}

	useEffect(() => {
		const energyInterval = setInterval(() => {
			if (energy > 100) {
				setEnergy(100)
			}

			if (energy === 100) {
				return
			}

			setEnergy((e) => Math.min(e + 1, 100))
		}, 1000)

		const autoInterval = setInterval(() => {
			if (!autoMode) {
				return
			}

			setScore((s) => s + 1)
		}, 1000)

		return () => {
			clearInterval(energyInterval)
			clearInterval(autoInterval)
		}
	}, [energy, autoMode])

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				{Intl.NumberFormat().format(score)}
			</header>
			<main className={styles.main}>
				<button onPointerDown={handleClick} type="button">
					Это фрукт. Не судите его, он старается в меру своих сил.
				</button>
			</main>
			<footer className={styles.footer}>
				<section>Энергия: {energy}</section>
				<section className={styles.auto}>
					<div
						className={[
							styles.indicator,
							autoMode ? styles.on : styles.off,
						].join(' ')}
					/>
					<button onClick={() => setAutoMode((a) => !a)} type="button">
						Авто режим
					</button>
				</section>
			</footer>

			<div className={styles.tapContainer}>
				{taps.map((tap) => (
					<Tap tap={tap} removeTap={removeTap} key={tap.id} />
				))}
			</div>
		</div>
	)
}

function Tap(props: {
	tap: Tap
	removeTap: (id: number) => void
}) {
	useEffect(() => {
		const timeout = setTimeout(() => {
			props.removeTap(props.tap.id)
		}, 1000)

		return () => {
			clearTimeout(timeout)
		}
	}, [props.tap.id, props.removeTap])

	return (
		<div
			className={styles.tap}
			style={{
				top: props.tap.y,
				left: props.tap.x,
			}}
		>
			+1
		</div>
	)
}
