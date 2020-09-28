import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {useContext} from 'react';
import {ElicitationContext} from '../ElicitationContext';
import MostImportantChoice from '../MostImportantChoice/MostImportantChoice';
import SwingButtons from '../SwingButtons/SwingButtons';
import SwingSetWeights from '../SwingSetWeights/SwingSetWeights';

export default function ImpreciseSwingWeighting() {
  const {currentStep} = useContext(ElicitationContext);

  return (
    <Grid container item spacing={4} sm={12} md={9} component={Paper}>
      <Grid item xs={12}>
        <Typography id="swing-weighting-title-header" variant="h4">
          Imprecise swing weighting <InlineHelp helpId="swing-weighting" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {currentStep === 1 ? <MostImportantChoice /> : <SwingSetWeights />}
      </Grid>
      <Grid item xs={9}>
        <SwingButtons />
      </Grid>
      <Grid item xs={3} container alignItems="center" justify="flex-end">
        <Grid item id="step-counter">
          Step {currentStep} of 2
        </Grid>
      </Grid>
    </Grid>
  );
}