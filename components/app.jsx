//-*- mode: rjsx-mode;

'use strict';

const React = require('react');
const ReactDom = require('react-dom');
import validator from 'validator';
const Tab = require('./tab.jsx');

/*************************** App Component ***************************/

const TABS = {
  shorten: 'Shorten Text',
  info: 'URL Info',
};

class App extends React.Component {

  constructor(props) {
    super(props);

    this.select = this.select.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.executeSubmit = this.executeSubmit.bind(this);
    this.handlechange =this.handlechange.bind(this);
    this.handleinfo = this.handleinfo.bind(this);
    this.getinfo =this.getinfo.bind(this);

    this.state = {
      selected: 'shorten',
      value1: '',
      value2: '',
      result: '',
      result2: '',
      i: '',
      r: ''
    };

  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  isSelected(v) { return v === this.state.selected; }

  select(v) {
    this.setState({selected: v});
  }
  handlechange(event)
  {
    this.setState({value1: event.target.value});
  }

  async executeSubmit()
  {
    this.state.result ='';
    const r =this.state.value1;
    this.setState({r});
    this.setState({result: await this.props.ws.translate(r)});
  }

  handleinfo(event)
  {
    this.setState({value2: event.target.value});
  }

  async getinfo(event)
  {
    this.state.result2 ='';
    const i =this.state.value2;
    this.setState({i});
    event.preventDefault();
    if(validator.isURL(i) === false)
    {
      this.setState({error: 'bad url'});
    }
    else
    {
      this.setState({error: ' '});
      try
      {
        this.setState({result2: await this.props.ws.info(i)});
      }
      catch(error)
      {
        this.setState({error: await error.message});
      }
    }
  }

  getComponent(v) {
    let component = null;
    if(v === 'shorten')
    {
      component = <form>
                    <h1>Shorten Text</h1>
                    <h2>Text</h2>
                    <textarea name ="text" className ="form-control" value={this.state.value1} onChange={this.handlechange}/>
                    <button type="button" onClick={this.executeSubmit} className="btn">Shorten Text</button>
                    <h2>Shortened Text</h2>
                    <div dangerouslySetInnerHTML={{__html: this.state.result}}/>
                  </form>
    }
    if(v === 'info')
    {
      component = <form onSubmit={this.getinfo}>
                    <h1>URL Information</h1>
                    <div>{this.state.error}</div>
                    <h2>Text</h2>
                    <input type ="text" className ="form-control" value={this.state.value2} onChange={this.handleinfo}/>
                      <dt>longUrl: {this.state.result2.longUrl} </dt>
                      <dt>shortUrl: {this.state.result2.shortUrl} </dt>
                      <dt>count: {this.state.result2.count} </dt>
                      <dt>isActive: {JSON.stringify(this.state.result2.isActive)} </dt>
                  </form>
    }
    return component;
  }

  render() {
    const wsState = this.props.ws.nChanges;
    const tabs = Object.entries(TABS).map(([k, v], i) => {
      const component = this.getComponent(k);
      const label = v;
      const isSelected = (this.state.selected === k);
      const tab = (
        <Tab component={component} id={k}
             label={label} index={i} key={i}
             select={this.select} isSelected={isSelected}/>
      );
      return tab;
    });

    return <div className="tabs">{tabs}</div>
  }

}

module.exports = App;
