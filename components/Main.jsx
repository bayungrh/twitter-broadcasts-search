import { useState } from 'react';
import rp from 'request-promise';
import { Icon, Input, Container, Card, Image, Grid, Message, Loader } from 'semantic-ui-react';

const MainComponent = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const searchTweet = () => {
    if (!query) return;
    setLoading(true);
    return rp({
      uri: `http://localhost:4000/api/search?query=${query}`,
      method: 'GET',
      json: true
    }).then((res) => {
      console.log('res', res);
      setData(res);
    }).finally(() => {
      setLoading(false);
    });
  }

  const inputQuery = (e) => {
    setQuery(e.target.value);
  }

  return (
    <div>
      <Container style={{marginTop: '50px'}}>
        <Message compact style={{width: '100%'}}>
          Twitter Broadcasts Search!
        </Message>
        <Input
          icon={<Icon name='search' inverted circular link onClick={searchTweet} />}
          placeholder='Example: spain vs italy euro'
          onChange={inputQuery}
          style={{width:'100%', paddingBottom: '50px'}}
        />
        {loading && <div style={{textAlign:'center'}}><Loader active inline /></div>}
        <Grid columns={4}>
          <Grid.Row>
            { data && data.map((val) => {
              let img, url, title, description;
              if (val.entities && val.entities.urls && val.entities.urls.length > 0) {
                const urls = val.entities.urls;
                url = urls[0].expanded_url;
                title = urls[0].title;
                description = urls[0].description;
                img = urls.find((u) => u.images);
                if (img) {
                  img = img.images[0].url;
                }
              }
              console.info(url);
              return (
                <Grid.Column>
                  <Card>
                    <Image src={img ? img : 'https://via.placeholder.com/500'} wrapped ui={false} />
                    <Card.Content>
                      <Card.Header>{title}</Card.Header>
                      <Card.Description>
                        {description ? description : val.text}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <a href={url}>
                        <Icon name='linkify' />
                        Visit
                      </a>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              )
            })}
          </Grid.Row>
        </Grid>
        <div style={{marginTop: '20px', textAlign: 'center  '}}>
          <p>Made using Next.js and Semantic UI.</p>
          <a href="https://github.com/bayungrh/twitter-broadcasts-search">View Repository</a>
        </div>
      </Container>
    </div>
  )
}

export default MainComponent;