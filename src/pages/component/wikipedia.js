
import {useState} from 'react'
import '../../stylesheets/wikipedia.sass'

export default function WikipediaView() {

  const [tableContent, setTableContent] = useState(<></>);
  const [searchTerm, setSearchTerm] = useState("");

/* Fetches data from the Wikipedia API based on a search term entered by the user,
 * and processes the response to create a wiki table if pages are found. */
  const fetchWikiData = () => {
    const url = `https://de.wikipedia.org/w/api.php?action=query&generator=prefixsearch&gpslimit=4&format=json&prop=extracts%7Cdescription&exintro=1&explaintext=1&exsentences=3&origin=*&gpssearch=${encodeURIComponent(searchTerm)}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        let query = data.query

        if (query && query.pages && searchTerm !== "") {
          createWikiTable(query)
        } else {
          console.error('No pages found in the response');
        }

      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

/* Creates a table of Wikipedia search results based on the query object returned by the Wikipedia API. */
  const createWikiTable = (query) => {
    const table = [];
  
    // Adds table header
    table.push(
      <thead key="table-header">
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Extract</th>
          <th>Link</th>
        </tr>
      </thead>
    );
  
    // Adds table rows for each page in the query object
    const tableBody = Object.keys(query.pages).map(pageId => {
      const page = query.pages[pageId];
      return (
        <tr key={page.pageid}>
          <td>{page.title}</td>
          <td>{page.description}</td>
          <td>{page.extract}</td>
          <td><a href={`https://de.wikipedia.org/?curid=${page.pageid}`}>Link</a></td>
        </tr>
      );
    });
  
    // Adds the table body to the table
    table.push(<tbody key="table-body">{tableBody}</tbody>);
  
    setTableContent(table);
  };
  
  /* Handles the input change event */
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /* Handles the form submission event */
  const handleSubmit = async (event) => {
    event.preventDefault();
    fetchWikiData();
  };

  return (
    <div>
      <div className="Container">
        <div>
          <div>
          </div>
          <h2 className='title'>Wikipedia Search</h2>
          <form onSubmit={handleSubmit}>
              <input type="text" name="city" id="city" onChange={handleInputChange}/>
              <input type="submit" value="Suchen" />
          </form>
        </div>
      </div>
      <table>
        {tableContent}
      </table>
    </div>

  );
}