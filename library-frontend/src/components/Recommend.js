import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommend = ({ show, favoriteGenre }) => {
    const filteredBooks = useQuery(ALL_BOOKS, { variables: { genre: favoriteGenre }})
    if (!show) {
        return null
    }
    
    return (
        <div>
        <h2>recommendations</h2>
        {favoriteGenre.length > 0 ? <div>books in your favorite genre <b>{favoriteGenre}</b></div> : null}
        
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
        </div>
    )
}

export default Recommend