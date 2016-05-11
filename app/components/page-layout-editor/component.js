import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout,
  classNames: ['page-layout-editor'],

  hasSections: Ember.computed('model.sections.length', function() {
    return this.get('model.sections.length') > 0;
  }),

  dropTargetModel: null,

  /**
   * Get the event bus
   */
  eventBus: Ember.inject.service('event-bus'),

  init(){
    this._super(...arguments);
    //event handler to listen to eventBus
    this.get('eventBus').on('showDropTarget', this, 'onShowDropTarget');
    this.get('eventBus').on('hideDropTarget', this, 'onHideDropTarget');
  },

  willDestroyElement(){
    this.get('eventBus').off('showDropTarget', this, 'onShowDropTarget');
    this.get('eventBus').off('hideDropTarget', this, 'onHideDropTarget');
  },

  /**
   * Drop-Target is a shared control across the entire
   * page-layout. It's used to show the location of a
   * drop target. By using a shared element, we can
   * only have one active at a time.
   */
  onShowDropTarget(dropTargetModel){
    this.set('dropTargetModel', dropTargetModel);
    this.$('.drop-target').css({display:'block'});
  },

  /**
   * Simply hide the Drop-Target
   */
  onHideDropTarget(){
    this.$('.drop-target').css({display:'none'});
  },

  dragEnter(event){
    let td = this.get('eventBus.transferData');

    // only if dragged object is a section
    if(!td || td.objectType !=='section') {
      return;
    }
    console.info('PAGE-LAYOUT-EDITOR VALID DROP TARGET FOR ' + td.objectType);
    event.preventDefault();

    // TODO: what to do w/ dragged section
  },

  dragOver(event){
    //can accept a section
    let td = this.get('eventBus.transferData');

    // only if dragged object is a section
    if(!td || td.objectType !=='section') {
      return;
    }

    // user is draggini sections, we'll handle this
    event.preventDefault();
  },

  dragLeave(){
    this.get('eventBus').trigger('hideDropTarget');
  },

  drop(/*event*/){
    let td = this.get('eventBus.transferData');
    // only if dragged object is a section
    if(!td || td.objectType !=='section') {
      return;
    }
    console.info('DROP ON PAGE-LAYOUT-EDITOR ' + this.get('elementId') + ' for ' + td.objectType);

    // we're droppin' sections
    // get the section from the event bus
    let newSection = td.model;
    // if we're moving a section, need to first
    // remove it from the page
    if (td.dragType === 'move') {
      this._removeSection(newSection);
    }

    // insert the section
    this._insertSection(newSection, td.dropSectionInfo.section, td.dropSectionInfo.insertAfter);

    // clear event bus drag/drop info
    // and hide drop target
    this.set('eventBus.transferData', null);
    this.get('eventBus').trigger('hideDropTarget');
  },

  _insertSection(section, targetSection, insertAfter) {
    const sections = this.get('model.sections');
    // where to insert?
    // default to the begining (left)
    let pos = 0;
    if (targetSection) {
      // if inserting before, use target card's current index
      // otherwise (inserting after) use the next index
      pos = sections.indexOf(targetSection) + (insertAfter ? 1 : 0);
    }
    sections.insertAt(pos, section);
  },

  _removeSection(section){
    console.info('PAGE-LAYOUT-EDITOR _removeSection');
    this.set('model.sections', this.get('model.sections').without(section));
  },

  actions: {
    onRowDrop(e, row) {
      this.sendAction('onDrop', e, row, this.get('moveRow'));
      this.set('moveRow', null);
    },
    onStartMove(e, row) {
      this.set('moveRow', row);
    },
    onDeleteSection(section){
      console.info('PAGE-LAYOUT-EDITOR onDeleteSection');
      this._removeSection(section);
    }

    // onRowDragEnter(row) {
    //   this.set('dragOverRow', row);
    //   // console.log('entered row', row.message);
    // },
    // onRowDragLeave(row) {
    //   if (this.get('dragOverRow') === row) {
    //     this.set('dragOverRow', null);
    //   }
    //   // console.log('leaving row', row.message);
    // }
  }
});
