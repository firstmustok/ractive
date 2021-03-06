import { create } from '../../utils/object';

const registryNames = [
	'adaptors',
	'components',
	'computed',
	'decorators',
	'easing',
	'events',
	'interpolators',
	'partials',
	'transitions'
];

class Registry {
	constructor ( name, useDefaults ) {
		this.name = name;
		this.useDefaults = useDefaults;
	}

	extend ( Parent, proto, options ) {
		this.configure(
			this.useDefaults ? Parent.defaults : Parent,
			this.useDefaults ? proto : proto.constructor,
			options );
	}

	init () {
		// noop
	}

	configure ( Parent, target, options ) {
		const name = this.name;
		const option = options[ name ];

		const registry = create( Parent[name] );

		for ( const key in option ) {
			registry[ key ] = option[ key ];
		}

		target[ name ] = registry;
	}

	reset ( ractive ) {
		const registry = ractive[ this.name ];
		let changed = false;

		Object.keys( registry ).forEach( key => {
			const item = registry[ key ];
			
			if ( item._fn ) {
				if ( item._fn.isOwner ) {
					registry[key] = item._fn;
				} else {
					delete registry[key];
				}
				changed = true;
			}
		});

		return changed;
	}
}

const registries = registryNames.map( name => new Registry( name, name === 'computed' ) );

export default registries;
