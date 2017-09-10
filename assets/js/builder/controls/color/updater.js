var $ = jQuery;

export class Updater {
	constructor( context ) {
		this.$html = $( context );
		this.$head = this.$html.find( 'head' );

		this.registeredSassComponents = [];
		this.stylesState = [];
	}

	init() {
		this._setup();
	}

	_setup() {
		$( () => {
			this._initialRender();
		} );
	}

	test() {
		this.update( {
			id: 'bg-controls-colors',
			css: 'dddd',
			scss: 'aassd'
		} );
	}

	register( data ) {
		if ( ! data.id ) {
			throw 'Register Sass: Must Provide Name value.';
		}

		/**
		 * name, priority, auto_update
		 */
		this.registeredSassComponents.push(
			_.defaults( data, {
				priority: 99
			} )
		);

		return _.last( this.registeredSassComponents );
	}

	_initialRender() {
		for ( let style of this.registeredSassComponents ) {
			this.pushConfig( [
				{
					id: 'bg-controls-colors',
					priority: 5

					// Runtime
					// element
				}
			] );
		}

		this.sort();
		this.addAllStyles();
	}

	update( newValues ) {
		this.refreshId( newValues );
	}

	_pushComponent( config ) {
		this.stylesState.push( config );
	}

	_createState( config ) {
		config = this.register( config );
		this._pushComponent( config );
		this.sort();

		this.insertNewtag( config );
	}

	_insertNewtag( config ) {
		let prevIndex, newStateIndex;

		newStateIndex = _.find( this.stylesState, ( state ) => {
			return state.id === config.id;
		} );

		// Find the index before mine, and insert the html after.
		prevIndex = Math.max( newStateIndex - 1, 0 );
		config.$tag = this.createStyleTag( style.id );
		this.stylesState[ prevIndex ].$tag.after( config.$tag );
	}

	// Sort by priority.
	_sort() {
		this.stylesState = _.sortBy( this.stylesState, 'priority' );
	}

	// Render all elements.
	addAllStyles() {
		for ( let style of this.stylesState ) {
			style.$tag = this.createStyleTag( style.id );
			style.$tag.html( this.stylesState.css );
			this.$head.append( style.$tag );
		}
	}

	createStyleTag( id ) {
		return $( '<style rel="stylesheet" type="text/css" id="' + id + '"></style>' );
	}

	refreshIds( ids ) {
		for ( let style of this.stylesState ) {
			this.refreshId( style );
		}
	}

	refreshId( style ) {
		let state = this.stylesState[ style.id ];

		if ( ! state ) {

			// Push into the style state.
			this.createState( style );
		}

		// Check if this has been registered.
		style.$tag.html( style.css );
	}
}
