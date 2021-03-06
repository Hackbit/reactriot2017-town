import React, { Component } from 'react'
import { observer, PropTypes } from 'mobx-react'
import { action } from 'mobx'
import { borderBot, borderLeft, borderRight, borderTop, fullHeight, margin5, noTextSelect } from './../styles'
import * as b from 'react-bootstrap'
import g from 'glamorous'
import { css } from 'glamor'
import L from 'lazy.js'
import Multiplier from './Multiplier'
import Taxes from './Taxes'
import ElementDivider from './ElementDivider'
import StatsRow from './StatsRow'
import UnitGrid from './UnitGrid'
import BuildingGrid from './BuildingGrid'
import AlertContainer from 'react-alert'
import ModalHelp from './ModalHelp'
import ModalWar from './ModalWar'

const BigP = g.p({
  fontSize: '24px'
})

@observer
export default class App extends Component {
  // noinspection JSUnusedGlobalSymbols,JSUnresolvedVariable
  static propTypes = {
    appState: PropTypes.observableObject.isRequired
  }

  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
  }

  getProfessionsOneByOne () {
    return L(this.props.appState.populationState.workers)
      .zip(this.props.appState.populationState.soldiers)
      .flatten()
      .concat([
        { name: '', amount: '' },
        this.props.appState.populationState.soldiersPower
      ])
      .toArray()
  }

  render () {
    const { appState } = this.props
    return (
      <b.Row {...css(noTextSelect, margin5)} className='text-center'>
        <b.Col xs={3}>
          <b.Row>
            <b.Col xs={12} {...css(borderBot, borderRight)}>
              <BigP>
                Training
              </BigP>
              <Multiplier
                tip='How many unit train per click'
                elements={[1, 10, 100]}
                current={appState.trainingMultiplier}
                nameFormatter={n => 'x' + n}
                onChange={n => appState.setTrainingMultiplier(n)} />
            </b.Col>
          </b.Row>
          <b.Row>

            <b.Col xs={12} {...css(borderBot, borderRight)}>
              <BigP>
                Units
              </BigP>
              <UnitGrid
                canBuy={u => appState.canBuy(u)}
                onTrain={u => appState.buyUnit(u)}
                units={appState.populationState.soldiersAndWorkers} />
            </b.Col>
          </b.Row>
          <b.Row>
            <b.Col xs={12} {...css(borderBot, borderRight)}>
              <g.P fontSize='24px'>
                War
              </g.P>
              <ModalWar appState={appState} />
            </b.Col>
          </b.Row>
          <b.Row>
            <b.Col xs={12} {...css(fullHeight, borderRight)}>
              <BigP>
                Speed
              </BigP>
              <Multiplier
                tip='How many ticks per second (0 for pause)'
                elements={[0, 1, 2, 3]}
                current={appState.tickPerSecond}
                nameFormatter={n => n + 'x'}
                onChange={n => appState.setSpeed(n)} />
            </b.Col>
          </b.Row>
        </b.Col>
        <b.Col xs={5}>
          <b.Row>
            <b.Col xs={6}>
              <b.Button
                bsStyle='success'
                onClick={action(() => appState.init())}>
                New game
              </b.Button>
            </b.Col>
            <b.Col xs={6}>
              <ModalHelp />
            </b.Col>
          </b.Row>
          <b.Row>
            <b.Col xs={12} {...borderTop}>
              <BigP>
              Resource production rate
            </BigP>
              <ElementDivider>
                {L(appState.resourcesSpeed).map((stats, i) =>
                  <StatsRow
                    key={i}
                    stats={stats} />
                ).toArray()}
              </ElementDivider>
            </b.Col>
          </b.Row>
          <b.Row>
            <b.Col xs={12}>
              <BigP>
                Buildings
              </BigP>
              <BuildingGrid
                canUpgrade={b => appState.canUpgrade(b)}
                onUpgrade={b => appState.buyBuilding(b)}
                buildings={appState.buildingState.buildings}
              />
            </b.Col>
          </b.Row>
        </b.Col>
        <b.Col xs={4}>
          <b.Row>
            <b.Col xs={12} {...css(borderBot, borderLeft)}>
              <BigP>
                Resources
              </BigP>
              <ElementDivider>
                {appState.resourcesState.resources.map((e, i) =>
                  <StatsRow
                    key={i}
                    stats={e} />
                )}
              </ElementDivider>
            </b.Col>
          </b.Row>
          <b.Row>
            <b.Col xs={12} {...css(borderBot, borderLeft)}>
              <BigP>
                Population
              </BigP>
              <ElementDivider>
                {appState.populationState.population.map((e, i) =>
                  <StatsRow
                    key={i}
                    stats={e} />
                )}
              </ElementDivider>
              <br />
              <g.Div>
                <g.P fontSize='18px' width='50%' float='left'>
                  Workers
                </g.P>
                <g.P fontSize='18px' width='50%' float='left'>
                  Soldiers
                </g.P>
              </g.Div>
              <ElementDivider>
                {this.getProfessionsOneByOne().map((e, i) =>
                  <StatsRow
                    key={i}
                    stats={e} />
                )}
              </ElementDivider>
            </b.Col>
          </b.Row>
          <b.Row {...css(borderBot, borderLeft)}>
            <b.Col xs={12} >
              <BigP>
                Info
              </BigP>
              <ElementDivider>
                <StatsRow stats={appState.populationState.mortality} />
                <StatsRow stats={appState.populationState.displeasure} />
                <StatsRow stats={appState.populationState.populationStat} />
              </ElementDivider>
            </b.Col>
          </b.Row>
          <b.Row>
            <b.Col xs={12} {...css(borderLeft, fullHeight)}>
              <Taxes
                value={appState.populationState.taxPercent}
                onChangeComplete={n => appState.taxChange(n)}
                onChange={n => appState.setTax(n)} />
            </b.Col>
          </b.Row>
        </b.Col>
        <AlertContainer ref={a => { appState.msg = a }} {...this.alertOptions} />
      </b.Row>
    )
  }
}
