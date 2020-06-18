
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import Recommend from './components/Recommend'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const userResult = useQuery(ME)
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const [errorMessage, notify] = useState('')
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => {
      set.map(p => p.id).includes(object.id)
    }

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook )}
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  if (authorsResult.loading || booksResult.loading || userResult.loading) {
    return <div>loading...</div>
  }

  

  

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token ? 
          <button onClick={() => setPage('login')}>login</button>
        :
        <span><button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={() => logout()}>logout</button></span>}
        
        
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors
        show={page === 'authors'} authors={authorsResult.data.allAuthors} setError={notify}
      />

      <Books
        show={page === 'books'} books={booksResult.data.allBooks} 
      />

      <NewBook
        show={page === 'add'} setError={notify} updateCacheWith={updateCacheWith}
      />

      
      {token && userResult.data.me ? <Recommend
        show={page === 'recommend'} favoriteGenre={userResult.data.me.favoriteGenre}
      /> : null }

      <LoginForm
          setPage={setPage}
          show={page === 'login'}
          setToken={setToken}
          setError={notify}
        />
    </div>
  )
}

export default App