import React from 'react';
import { Container, Grid, Card, CardHeader, Divider, CardContent, Typography, Link } from '@mui/material';

const About = () => {
  return (
    <Container component={'main'}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ my: 4, boxShadow: 8, borderRadius: '4px' }}>
            <CardHeader title="About" sx={{ textAlign: 'center' }} />
            <Divider />
            <CardContent>
              <Typography variant="body1">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Richard's art studio is nestled in the vibrant city of Durham, North Carolina, where creativity thrives amidst a rich cultural tapestry. Drawing inspiration from the city's dynamic energy and diverse community, Richard's artwork captures the essence of Durham's unique spirit. With a deep passion for capturing the beauty of life on canvas, Richard's art invites viewers into a world of imagination and emotion.
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Having enjoyed art from a young age, Richard found early inspiration in drawing and origami. This love for artistic expression continued to blossom, leading to a high school acrylics painting class where Richard learned the basics of color theory and further honed artistic skills.
              </Typography>
              <Typography variant="body1">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After a hiatus, Richard recently rekindled a profound connection with art. In the fall of 2020, Richard embarked on a journey of self-teaching, diving into the world of oil painting. Exploring this new medium with boundless curiosity, Richard embraced the challenges and joys that come with expressing thoughts, emotions, and perspectives through brushstrokes and vibrant hues.
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Today, Richard's artwork reflects both the rich artistic foundation established in youth and the fresh perspectives gained through self-guided exploration. Each piece is a testament to the dedication and growth that accompanies the artist's ongoing artistic journey.
              </Typography>
              <Typography variant="body1">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In Richard's studio, brushstrokes come alive, colors harmonize on the canvas, and emotions are beautifully captured. Each artwork is a testament to Richard's dedication and a reflection of the artist's genuine passion for creating meaningful and engaging art.
              </Typography>
              <Typography variant="body1" sx={{ my: 2 }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For deeper insights into Richard's artistic process, inspirations, or to discuss commissioning a personalized piece, feel free to
                {' '}
                <Link to={"/contact"}> reach out</Link>
                . Richard welcomes the opportunity to connect with art enthusiasts, collectors, and fellow creators.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Container>
  );
};

export default About;