  
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const Authors = ({ authors, show, setError }) => {
  const [name, setName] = useState(authors.length > 0 ? authors[0].name : '')
  const [born, setBorn] = useState('')

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ {query: ALL_AUTHORS}, {query: ALL_BOOKS} ],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
      setTimeout(() => {
        setError(null)
      }, 5000)
    },
  })
  
  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
 
    const bornAsNumber = parseInt(born, 10)
    updateAuthor({
      variables: { name, born: bornAsNumber }
    })

    setName(authors.length > 0 ? authors[0].name : '')
    setBorn('')
    
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <div>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(author => 
              <option value={author.name}>{author.name}</option>)}
          </select>
        </div>
        <div>
          born
          <input 
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
      </div>
    </div>
  )
}

export default Authors
