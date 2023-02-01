// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const statuses = React.useMemo(
    () => ({
      idle: 'idle',
      pending: 'pending',
      resolved: 'resolved',
      rejected: 'rejected',
    }),
    [],
  )

  const [state, setState] = React.useState({
    error: null,
    pokemon: null,
    status: statuses.idle,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: statuses.pending})

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: statuses.resolved, pokemon})
      },
      error => {
        setState({status: statuses.rejected, error})
      },
    )
  }, [pokemonName, statuses])

  if (state.status === statuses.idle) {
    return <p>Submit a pokemon</p>
  } else if (state.status === statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (state.status === statuses.rejected) {
    throw state.error
  } else if (state.status === statuses.resolved) {
    return <PokemonDataView pokemon={state.pokemon} />
  }

  throw new Error('This should be impossible')
}

const ErrorFallback = ({error, resetErrorBoundary}) => (
  <div role="alert">
    There was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
)

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function onReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={onReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
