import React from 'react';
import { Container, Grid, Typography, Link } from '@mui/material';

const NoPageFound = () => {
  return (
    <section className="page_404">
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Grid item xs={10} sm={8} md={6} lg={4} xl={3} textAlign="center">
                <div
                  className="four_zero_four_bg"
                  style={{
                    backgroundImage: `url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)`,
                    height: '400px',
                    backgroundPosition: 'center',
                  }}
                >
                  <Typography variant="h1">404</Typography>
                </div>
                <div className="contant_box_404">
                  <Typography variant="h3">
                    Looks like you're lost
                  </Typography>
                  <Typography>
                    The page you are looking for is not available!
                  </Typography>
                  <Link href="/" className="link_404">
                    Go to Home
                  </Link>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default NoPageFound;