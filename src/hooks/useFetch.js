import { useEffect, useRef, useState } from 'react'

function useFetch(url, _options) {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	//storing refference value in useRef hook to avoid infinite loop with useEffect
	const options = useRef(_options).current

	useEffect(() => {
		//abort controller in js
		const controller = new AbortController()
		//associate controller with the async process so that controller knows which process it needs to abort, we do that by adding {signal: controller.signal} to fetch as 2nd argument

		const fetchData = async () => {
			setLoading(true)
			try {
				const response = await fetch(url, { signal: controller.signal })
				if (response.status === 200) {
					const json = await response.json()
					setData(json)
					setError(null)
				} else {
					throw new Error(`${response.status} : ${response.statusText}`)
				}
			} catch (error) {
				if (error.name === 'AbortError') {
					console.log('Fetch was aborted')
				} else {
					setError(`${error.message} - Could not fetch data`)
					setLoading(false)
				}
			}
		}

		fetchData()
		setLoading(false)

		//cleanup function fires whenever the component unmounts
		return () => {
			//abort any async task or subscriptions to any kind of data streams
			//abort with controller
			controller.abort()
		}
	}, [url, options])

	return { data, loading, error }
}
export default useFetch

//MEMORY LEAK
//while the fetch if in process we remove the component that is using the data that should be fetched
//eventhough we removed component, fetch is still ongoing and after is done react is trying to update the state in the component that is not there anymore
//we use cleanup functions in useEffect to cancel any kind of async tasks (async task is any task that returns promise - like fetching), so that useEffect doesn't try to update state in the component that is not there anymore (is unmounted)

//USE EFFECT AND REFFERENCE TYPE DEPENDENCIES
//when react reevaluates the component because it is comparing references in memory everytime component rerenders react will see those references as changed and trigger the rerender causing infinite loop
//to get around it there are couple of options:
//1.wrap the  refference type (object or array) in use state hook and pass the state as an argument to useFetch that will then pass it to useEffect inside of useFetch hook -  because any state value passed as a dependency will not cause infinite loop
//2. wrap the value in useRef hook inside of custom hook itself(in our case useFetch) - this will not cause infinite loop if we pass it as dependency
//when we store refference type in useRef hook  the ref values are not seen as different during the component reevaluation, so using referenced values as dependencies is not causing rerendering and infinite loop
