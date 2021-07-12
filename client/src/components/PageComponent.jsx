import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Collapse,
  Typography,
} from "@material-ui/core";
import "./PageComponent.css";

const PageComponent = ({
  pageUrl,
  imageUrl,
  xsSize,
  smSize,
  cardText,
  cardTitle,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Grid item xs={xsSize} sm={smSize}>
      <Card
        className="page-card"
        onClick={() => setExpanded(!expanded)}
        title={cardTitle}
      >
        <CardContent style={{ padding: 0 }}>
          <CardMedia style={{ height: 400, width: "auto" }} image={imageUrl} />
        </CardContent>
        <Collapse in={expanded}>
          <CardContent>
            <Typography>{cardText}</Typography>
            <br />
            <Button
              onClick={() => (window.location.href = pageUrl)}
              style={{ alignSelf: "center" }}
              variant="contained"
              color="primary"
            >
              Go to site
            </Button>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

export default PageComponent;
