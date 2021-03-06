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
  lgSize,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Grid item xs={xsSize} sm={smSize} lg={lgSize}>
      <Card
        className="page-card"
        onClick={() => setExpanded(!expanded)}
        title={cardTitle}
      >
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
              Visit site
            </Button>
          </CardContent>
        </Collapse>
        <CardContent style={{ padding: 0 }}>
          <CardMedia style={{ height: 400, width: "auto" }} image={imageUrl} />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PageComponent;
