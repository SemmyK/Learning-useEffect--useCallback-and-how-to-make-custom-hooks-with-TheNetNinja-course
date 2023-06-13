# Simple React App to introduce certain hooks in React

**First project of Build Web Apps with React & Firebase course on Udemy by The Net Ninja**

## Learning useEffect and useCallback hooks and creating custom hooks

//useEffect allows us to run some code only at specific times and when certain conditions are met

//useEffect runs when the component is first time loaded and after that runs only if any of its dependencies have changed value since the first loading

// if we want some code to run only once in ccomponent we leave depencency array empty so that it runs only at first loading/rendering of component and after that nothing triggers it to run again after the first run

//useEffect first argument function can not be async, but we can make and call async function inside of the useEffect in the body of the first argument function

//if useEffect has any changeable state in it, that state variable has to be in dependency array

//if we make function outside of useEffect and call it inside of useEffect, if we put it in a dependency array we will get infinite loop

//infinite loop happens because every rerender will recreate all the regular js variables and all the functions somewhere else in a memory (location of the function or variable changes) which will cause rerendering again and again creating an infinte loop because React is not comparing the name or the content of var or func it compares refferences to it

//Reference is something that points to a value in memory, since rerendering changes the location of func or js var in memory React sees it as a change and rerenders everything- causing a new 'change'

//in React we can negate this 'change' for js vars, arrays and objects by putting them in useState hook as a changeable state

// to negate this behaviour for functions we need to wrap functions in useCallback hook then call it in useEffect and we can then put function in dependency array of useEffect without causing infinite loop

//useCallback also takes the dependency array as second argument, values in dependency array tells to useCallback when to recreate the function inside - which state value change will cause rerendering and recreating function

<!-- FOR THE EXAMPLE IN TRIPLIST.JSX (all this code was replaced with useFetch hook)

useCallback has url as dependency, so we can remove it from dependency array of useEffect because change in url will cause useCallback to rerun and then useCallback will make useEffect to rerun the code inside (calling the fetchTrips func) if the url changes (chain reaction) -->

<!-- function to get trips from server -->

const fetchTrips = useCallback(async () => {

<!-- with async await we can use try/catch blog to catch the errors like we use in .then syntax -->

try {
const response = await fetch(url)
const json = await response.json()
setTrips(json)
} catch (error) {
console.log(error)
}

<!-- same code from above but with .then syntax
 fetch(url)
 .then(response => response.json())
 .then(data => setTrips(data))
 .catch(err=> console.log(err)) -->

}, [url])

useEffect(() => {
fetchTrips()
}, [fetchTrips])

## CUSTOM HOOK
 ### MEMORY LEAK explained
//while the fetch if in process we remove/unmount the component that is using the data that should be fetched
//eventhough we removed component, fetch is still ongoing and after is done react is trying to update the state in the component that is not there anymore
//to fix memory leak we use cleanup functions in useEffect to cancel any kind of async tasks (async task is any task that returns promise - like fetching), so that useEffect doesn't try to update state in the component that is not there anymore (is unmounted)
//in JS we have AbortController that we can use for cleanup in useEffect (example is in custom useFetch hook in folder hooks)

//also we can use useRef for cleanup:

1.  before any state in component make a isMounted ref
    const isMounted = useRef(true)
2.  in cleanup function return isMounted as false
    //useEffect code
    useEffect(() => {
    if (isMounted) {
    ...some async code (fetch or authentication something that will return promise and take time to fulfill)
    }

    //cleanup to fix memory leaks
    return () => (isMounted.current = false)
    }, [isMounted])

### USE EFFECT AND REFFERENCE TYPE DEPENDENCIES
//when react reevaluates the component because it is comparing references in memory everytime component rerenders react will see those references as changed and trigger the rerender causing infinite loop
//to get around it there are couple of options:
//1.wrap the refference type (object or array) in use state hook and pass the state as an argument to useFetch that will then pass it to useEffect inside of useFetch hook - because any state value passed as a dependency will not cause infinite loop
//2. wrap the value in useRef hook inside of custom hook itself(in our case useFetch) - this will not cause infinite loop if we pass it as dependency
//when we store refference type in useRef hook the ref values are not seen as different during the component reevaluation, so using referenced values as dependencies is not causing rerendering and infinite loop
