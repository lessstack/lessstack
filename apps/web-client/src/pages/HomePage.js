import React from "react";
import { css } from "@linaria/core";
import Container from "../components/Container";
import Grid from "../components/Grid";
import reactIcon from "../images/react-icon.svg";

const HomePage = () => (
  <>
    <Container>
      Hello <span className={style}>World</span>!
      <img alt="" src={reactIcon} />
    </Container>
    <Grid
      direction={{ xs: "vertical", s: "horizontal" }}
      spacing={{ xs: "XL", s: "M" }}
    >
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
      <Grid size={{ xs: 12, s: 1 }}>A</Grid>
    </Grid>
  </>
);

export default HomePage;

const style = css`
  color: #ff22cc;
`;
