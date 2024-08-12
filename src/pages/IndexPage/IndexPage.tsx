import { useEffect, useState } from 'react'
import styles from './indexPage.module.scss'

export function IndexPage() {
	const [score, setScore] = useState(1000000)
	const [energy, setEnergy] = useState(100)
	const [autoMode, setAutoMode] = useState(false)

	function handleClick() {
		if (energy < 1) {
			return
		}

		setScore((s) => s + 1)
		setEnergy((e) => e - 1)
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
				<button onClick={handleClick} type="button">
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
		</div>
	)
}
