import { useInitData } from '@telegram-apps/sdk-react'
import { type PointerEvent, useEffect, useState } from 'react'
import styles from './indexPage.module.scss'

type Tap = {
	id: number
	x: number
	y: number
}

const maxEnergy = 1000

export function IndexPage() {
	const initData = useInitData()
	const [userId] = useState<number | undefined>(initData?.user?.id)
	const [score, setScore] = useState<number | undefined>(undefined)
	const [energy, setEnergy] = useState<number | undefined>(undefined)

	function updateScore(score: number) {
		setScore(score)
	}

	function updateEnergy(energy: number) {
		setEnergy(energy)
	}

	useEffect(() => {
		async function getData() {
			if (!userId) {
				return
			}
			const res = await fetch(
				`http://localhost:8002/test/user_entry_check/${userId}`,
			)
			const data = (await res.json()) as { energy: number; coins: number }
			setScore(data.coins)
			setEnergy(data.energy)
		}

		getData()
	}, [])

	if (score === undefined || energy === undefined) {
		return null
	}

	return (
		<Main
			score={score}
			energy={energy}
			updateScore={updateScore}
			updateEnergy={updateEnergy}
		/>
	)
}

function Main(props: {
	score: number
	energy: number
	updateScore: (score: number) => void
	updateEnergy: (energy: number) => void
}) {
	const [score, setScore] = useState(props.score)
	const [energy, setEnergy] = useState(props.energy)
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
			if (energy > maxEnergy) {
				setEnergy(maxEnergy)
			}

			if (energy === maxEnergy) {
				return
			}

			setEnergy((e) => Math.min(e + 1, maxEnergy))
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

	useEffect(() => {
		props.updateScore(score)
		props.updateEnergy(energy)
	}, [score, energy, props.updateScore, props.updateEnergy])

	return (
		<>
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
					<section>
						<Energy energy={energy} />
					</section>
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
		</>
	)
}

function Energy(props: { energy: number }) {
	return (
		<div className={styles.energy}>
			<span>{props.energy}</span>
			<div style={{ width: `${(props.energy / maxEnergy) * 100}%` }} />
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
