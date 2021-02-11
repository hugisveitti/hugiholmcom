import React from "react";
import { Card, CardContent, CardMedia, Grid } from "@material-ui/core";
import "./PageComponent.css";

const PageComponent = ({ pageUrl, imageUrl, xsSize, smSize }) => {
  return (
    <Grid item xs={xsSize} sm={smSize}>
      <Card
        className="page-card"
        onClick={() => (window.location.href = pageUrl)}
      >
        <CardContent style={{ padding: 0 }}>
          <CardMedia style={{ height: 400, width: "auto" }} image={imageUrl} />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PageComponent;
