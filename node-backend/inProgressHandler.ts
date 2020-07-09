import IAlternativeCommand from '@shared/interface/IAlternativeCommand';
import ICellCommand from '@shared/interface/ICellCommand';
import ICriterionCommand from '@shared/interface/ICriterionCommand';
import IDataSourceCommand from '@shared/interface/IDataSourceCommand';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import _ from 'lodash';
import InProgressWorkspaceRepository from './inProgressRepository';
import {
  buildEmptyInProgress,
  buildInProgressCopy,
  buildProblem,
  createOrdering
} from './inProgressRepositoryService';
import logger from './loggerTS';
import OrderingRepository from './orderingRepository';
import {getUser, handleError} from './util';
import WorkspaceHandler from './workspaceHandler';
import WorkspaceRepository from './workspaceRepository';
import {Error} from '@shared/interface/IError';

export default function InProgressHandler(db: any) {
  const inProgressWorkspaceRepository = InProgressWorkspaceRepository(db);
  const workspaceRepository = WorkspaceRepository(db);

  const workspaceHandler = WorkspaceHandler(db);
  const orderingRepository = OrderingRepository(db);

  function createEmpty(
    request: Request,
    response: Response,
    next: () => {}
  ): void {
    const user: {id: string} = getUser(request);
    const emptyInProgress = buildEmptyInProgress();
    inProgressWorkspaceRepository.create(
      user.id,
      emptyInProgress,
      _.partial(createCallback, response, next)
    );
  }

  function createCopy(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const user: {id: string} = getUser(request);
    const sourceWorkspaceId = request.body.sourceWorkspaceId;
    waterfall(
      [
        _.partial(workspaceRepository.get, sourceWorkspaceId),
        buildInProgress,
        _.partial(createNew, user.id)
      ],
      _.partial(createCallback, response, next)
    );
  }

  function createCallback(
    response: Response,
    next: () => void,
    error: Error,
    createdId: string
  ) {
    if (error) {
      handleError(error, next);
    } else {
      response.status(CREATED);
      response.json({id: createdId});
    }
  }

  function buildInProgress(
    workspace: IOldWorkspace,
    callback: (error: Error, inProgressCopy: IWorkspace) => void
  ) {
    callback(null, buildInProgressCopy(workspace));
  }

  function createNew(
    userId: string,
    inProgressCopy: IWorkspace,
    callback: (error: Error, createdId: string) => void
  ) {
    inProgressWorkspaceRepository.create(userId, inProgressCopy, callback);
  }

  function get(request: Request, response: Response, next: () => void): void {
    inProgressWorkspaceRepository.get(
      request.params.id,
      (error: any, inProgressWorkspace: IInProgressMessage) => {
        if (error) {
          handleError(error, next);
        } else {
          response.status(OK);
          response.json(inProgressWorkspace);
        }
      }
    );
  }

  function updateWorkspace(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.updateWorkspace(
      request.body,
      (error: any) => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function updateCriterion(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const command: ICriterionCommand = request.body;
    inProgressWorkspaceRepository.upsertCriterion(command, (error: any) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(OK);
      }
    });
  }

  function deleteCriterion(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteCriterion(
      request.params.criterionId,
      (error: any) => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function updateDataSource(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const command: IDataSourceCommand = request.body;
    inProgressWorkspaceRepository.upsertDataSource(command, (error: any) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(OK);
      }
    });
  }

  function deleteDataSource(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteDataSource(
      request.params.dataSourceId,
      (error: any) => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function updateAlternative(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const command: IAlternativeCommand = request.body;
    inProgressWorkspaceRepository.upsertAlternative(command, (error: any) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(OK);
      }
    });
  }

  function deleteAlternative(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteAlternative(
      request.params.alternativeId,
      (error: any) => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function updateCell(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const cells: ICellCommand[] = [request.body];
    inProgressWorkspaceRepository.upsertCellsDirectly(cells, (error: any) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(OK);
      }
    });
  }

  function createWorkspace(
    request: Request,
    response: Response,
    next: (error: any) => void
  ): void {
    const inProgressId = request.params.id;
    waterfall(
      [
        _.partial(inProgressWorkspaceRepository.get, inProgressId),
        buildProblemFromInProgress,
        _.partial(createInTransaction, request.user, inProgressId)
      ],
      (error: Error, createdWorkspaceInfo: IWorkspaceInfo): void => {
        if (error) {
          logger.debug('error creating workspace from in progress ' + error);
          next(error);
        } else {
          response.status(CREATED);
          response.json(createdWorkspaceInfo);
        }
      }
    );
  }

  function buildProblemFromInProgress(
    inProgressMessage: IInProgressMessage,
    callback: (error: any, problem?: IProblem) => void
  ) {
    callback(null, buildProblem(inProgressMessage));
  }

  function createInTransaction(
    user: any,
    inProgressId: string,
    problem: IProblem,
    overallCallback: (
      error: Error,
      createdWorkspaceInfo?: IWorkspaceInfo
    ) => void
  ): void {
    const fakeRequest = {
      user: user,
      body: {
        problem: problem,
        title: problem.title
      }
    };
    db.runInTransaction(
      (
        client: any,
        transactionCallback: (
          error: Error,
          createdWorkspaceInfo?: IWorkspaceInfo
        ) => void
      ) => {
        waterfall(
          [
            _.partial(
              workspaceHandler.createWorkspaceTransaction,
              fakeRequest as Request,
              client
            ),
            _.partial(deleteInprogress, client, inProgressId),
            _.partial(insertOrdering, client)
          ],
          transactionCallback
        );
      },
      (error: Error, createdWorkspaceInfo?: IWorkspaceInfo): void => {
        overallCallback(error, error ? null : createdWorkspaceInfo);
      }
    );
  }

  function deleteInprogress(
    client: any,
    inProgressId: string,
    createdWorkspaceInfo: IWorkspaceInfo,
    callback: (error: Error, createWorkspaceInfo?: IWorkspaceInfo) => void
  ): void {
    inProgressWorkspaceRepository.deleteInTransaction(
      client,
      inProgressId,
      (error: Error) => {
        callback(error, error ? null : createdWorkspaceInfo);
      }
    );
  }

  function insertOrdering(
    client: any,
    createdWorkspaceInfo: IWorkspaceInfo,
    callback: (error: Error, createdWorkspaceInfo?: IWorkspaceInfo) => void
  ) {
    const ordering = createOrdering(
      createdWorkspaceInfo.problem.criteria,
      createdWorkspaceInfo.problem.alternatives
    );
    orderingRepository.updateInTransaction(
      client,
      createdWorkspaceInfo.id,
      ordering,
      (error: Error) => {
        if (error) {
          callback(error);
        } else {
          callback(null, createdWorkspaceInfo);
        }
      }
    );
  }

  function query(request: Request, response: Response, next: () => {}): void {
    const user: {id: number} = getUser(request);
    inProgressWorkspaceRepository.query(
      user.id,
      (error: Error, results: any[]) => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(results);
        }
      }
    );
  }

  function del(request: Request, response: Response, next: () => {}): void {
    inProgressWorkspaceRepository.deleteDirectly(
      request.params.id,
      (error: Error) => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(OK);
        }
      }
    );
  }

  return {
    createEmpty: createEmpty,
    createCopy: createCopy,
    get: get,
    updateWorkspace: updateWorkspace,
    updateCriterion: updateCriterion,
    deleteCriterion: deleteCriterion,
    updateDataSource: updateDataSource,
    deleteDataSource: deleteDataSource,
    updateAlternative: updateAlternative,
    deleteAlternative: deleteAlternative,
    updateCell: updateCell,
    createWorkspace: createWorkspace,
    query: query,
    delete: del
  };
}