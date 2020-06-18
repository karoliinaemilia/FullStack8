import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ({ books, show }) => {
  const [filter, setFilter] = useState('')
  const filteredBooks = useQuery(ALL_BOOKS, { variables: { genre: filter }})
  
  if (!show) {
    return null
  }

  const genres = []

  books.forEach(book => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })  
  });

  return (
    <div>
      <h2>books</h2>
      {filter.length > 0 ? <div>in genre <b>{filter}</b></div> : null}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map(genre => 
          <button value={genre} onClick={({target}) => setFilter(target.value)}>
            {genre}
          </button>)}
          <button onClick={() => setFilter('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books