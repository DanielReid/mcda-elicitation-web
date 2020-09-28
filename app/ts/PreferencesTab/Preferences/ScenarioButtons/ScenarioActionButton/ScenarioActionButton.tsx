import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import createEnterHandler from 'app/ts/util/createEnterHandler';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {checkScenarioTitleErrors, showErrors} from '../ScenarioUtil';

export default function ScenarioActionButton({
  action,
  icon,
  callback,
  idOfScenarioBeingEdited
}: {
  action: string;
  icon: JSX.Element;
  callback: (newTitle: string) => void;
  idOfScenarioBeingEdited?: string;
}) {
  const {currentScenario, scenarios} = useContext(PreferencesContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [errors, setErrors] = useState<string[]>(
    checkScenarioTitleErrors(title, scenarios, idOfScenarioBeingEdited)
  );

  useEffect(() => {
    setErrors(
      checkScenarioTitleErrors(title, scenarios, idOfScenarioBeingEdited)
    );
  }, [title]);

  const handleKey = createEnterHandler(handleButtonClick, isDisabled);

  function closeDialog(): void {
    setIsDialogOpen(false);
  }

  function openDialog(): void {
    setTitle(idOfScenarioBeingEdited ? currentScenario.title : '');
    setIsDialogOpen(true);
  }

  function titleChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
    setTitle(event.target.value);
  }

  function handleButtonClick(): void {
    callback(title);
    closeDialog();
  }

  function isDisabled(): boolean {
    return errors.length > 0;
  }

  return (
    <>
      <Tooltip title={action + ' scenario'}>
        <IconButton
          id={action.toLowerCase() + '-scenario-button'}
          onClick={openDialog}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitleWithCross id="dialog-title" onClose={closeDialog}>
          {action} scenario
        </DialogTitleWithCross>
        <DialogContent>
          <Grid container>
            <Grid item xs={9}>
              <TextField
                label="new title"
                id="new-scenario-title"
                value={title}
                onChange={titleChanged}
                onKeyDown={handleKey}
                autoFocus
                fullWidth
              />
            </Grid>
            {showErrors(errors)}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            id={action.toLowerCase() + '-scenario-confirm-button'}
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            disabled={isDisabled()}
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}