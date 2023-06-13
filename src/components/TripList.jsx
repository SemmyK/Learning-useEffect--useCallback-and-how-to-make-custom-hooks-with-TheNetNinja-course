import { useState } from 'react'
//style
import './TripList.css'
//hooks
import useFetch from '../hooks/useFetch'

function TripList() {
	const [url, setUrl] = useState('http://localhost:3000/trips')
	const { data, loading, error } = useFetch(url, { type: 'GET' })

	return loading ? (
		<h3>Loading...</h3>
	) : error ? (
		<h3>{error}</h3>
	) : (
		<div className='trip-list'>
			<h2>TripList</h2>
			{data ? (
				<ul>
					{data.map(trip => (
						<li key={trip.id}>
							<h3>{trip.title}</h3>
							<p>{trip.price}</p>
						</li>
					))}
				</ul>
			) : (
				<h3>No trips to show</h3>
			)}
			<div className='filters'>
				<button onClick={() => setUrl(prev => prev + '?loc=europe')}>
					European Trips
				</button>
				<button onClick={() => setUrl('http://localhost:3000/trips')}>
					All Trips
				</button>
			</div>
		</div>
	)
}
export default TripList
