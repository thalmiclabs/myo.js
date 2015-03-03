/**
 * Relative Direction Waves
 */
Myo.options.use_relative_waves = false;
Myo.on('wave_in', function(edge){
	(this.arm == 'left') ?
		this.trigger('wave_right', edge) :
		this.trigger('wave_left', edge);
});
Myo.on('wave_out', function(edge){
	(this.arm == 'left') ?
		this.trigger('wave_left', edge) :
		this.trigger('wave_right', edge);
});