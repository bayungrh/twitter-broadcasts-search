import { Card, Button, CardColumns, InputGroup, FormControl } from 'react-bootstrap';
import React, { useState } from 'react';
import rp from 'request-promise';

const CardComponent = (props) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const searchTweet = (e) => {
    setLoading(true);
    return rp({
      uri: `http://localhost:4000/api/search?query=${query}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAAO5xOAEAAAAAqv6lN%2FQTgqaE4OL%2F1Zjz7eraGbg%3D482czzfeQJhu8c3RVF9t8zivq72yC36OiruycdnoJURfLsPDml`
      },
      json: true
    }).then((res) => {
      console.log('res', res);
        setData(res);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  const inputQuery = (e) => {
    setQuery(e.target.value);
  }
  

  return (
    <div className="container mt-5">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          onChange={inputQuery}
          value={query}
          placeholder="spain vs switzerland live stream"
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={searchTweet}>Search</Button>
        </InputGroup.Append>
      </InputGroup>
      <CardColumns>
      
      {loading && <span>Loading...</span>}

      { data && data.map((val) => {
        let img, url, title, description;
        if (val.entities && val.entities.urls && val.entities.urls.length > 0) {
          const urls = val.entities.urls;
          url = urls[0];
          title = urls[0].title;
          description = urls[0].description;
          img = urls.find((u) => u.images);
          if (img) {
            img = img.images[0].url;
          }
        }
        
        return (
          <Card>
            <Card.Img variant="top" src={img ? img : 'https://via.placeholder.com/500'} />
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Card.Text>
                {description ? description : val.text}
              </Card.Text>
              <Card.Link href={url ? url : `https://twitter.com/${val.author_id}/status/${val.id}`}>Link</Card.Link>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">{val.created_at}</small>
            </Card.Footer>
          </Card>
        )
      })}

      </CardColumns>
    </div>
  )
}

export default CardComponent;