import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('copy');
  this.route('rows');
  this.route('bscards');
  this.route('page');
  this.route('empty');
});

export default Router;
