import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {
  getBest,
  getWorst
} from '../../PartialValueFunctions/PartialValueFunctionUtil';
import {buildImportance} from './PreferencesWeightsTableUtil';

export default function PreferencesWeightsTable() {
  const {criteria, pvfs, currentScenario, problem} = useContext(
    PreferencesContext
  );
  const importances: Record<string, string> = buildImportance(
    criteria,
    currentScenario.state.prefs
  );

  function getWeight(criterionId: string) {
    return currentScenario.state.weights
      ? significantDigits(currentScenario.state.weights.mean[criterionId])
      : '?';
  }

  return (
    <Table id="perferences-weights-table">
      <TableHead>
        <TableRow>
          <TableCell>Criterion</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell>Best</TableCell>
          <TableCell>Worst</TableCell>
          <TableCell>Importance</TableCell>
          <TableCell>Weight</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {_.map(criteria, (criterion) => {
          return (
            <TableRow key={criterion.id}>
              <TableCell>{criterion.title}</TableCell>
              <TableCell>{criterion.description}</TableCell>
              <TableCell>{criterion.unitOfMeasurement.label}</TableCell>
              <TableCell>{getWorst(pvfs[criterion.id])}</TableCell>
              <TableCell>{getBest(pvfs[criterion.id])}</TableCell>
              <TableCell>{importances[criterion.id]}</TableCell>
              <TableCell>{getWeight(criterion.id)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
