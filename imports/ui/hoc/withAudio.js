import React, {Fragment} from 'react';
import ReactAudioPlayer from 'react-audio-player';
import './withAudio.css';

const withAudio = (WrappedComponent) => {

  return class extends React.Component {
    state = {
      song_url: "full-theme"
    };

    constructor(props) {
      super(props);
      this.player = React.createRef();
    }

    get audio() {
      return this.player.audioEl;
    }

    playAudioTrack = (track_name) => {
      this.setState({song_url: track_name});
      this.player.audioEl.currentTime = 0;
      const promise = this.player.audioEl.play();

      if (promise !== undefined) {
        promise.then(_ => {
          // Autoplay started!
        }).catch(error => {
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
        });
      }
    };

    playBuzzIn = () => {
      this.playAudioTrack('buzz-in');
    };

    playCommercialBreak = () => {
      this.playAudioTrack('commercial-break');
    };

    playFastMoneyReveal = () => {
      this.playAudioTrack('fast-money-reveal');
    };

    playFullTheme = () => {
      this.playAudioTrack('full-theme');
    };

    playMediumTheme = () => {
      this.playAudioTrack('medium-theme');
    };

    playNumberOne = () => {
      this.playAudioTrack('number-one');
    };

    playRight = () => {
      this.playAudioTrack('right');
    };

    playShortTheme = () => {
      this.playAudioTrack('short-theme');
    };

    playTimesUp = () => {
      this.playAudioTrack('times-up');
    };

    playWrongLong = () => {
      this.playAudioTrack('wrong-long');
    };

    playWrongShort = () => {
      this.playAudioTrack('wrong-short');
    };

    pause = () => {
      this.audio.pause();
    };

    play = () => {
      this.audio.play();
    };

    restart = () => {
      this.audio.currentTime = 0;
      this.audio.play();
    };

    toggle = () => {
      if(this.player.audioEl.paused) {
        this.player.audioEl.play();
      } else {
        this.player.audioEl.pause();
      }
    };

    render() {
      return (
        <Fragment>
          <ReactAudioPlayer
            src={'/'+this.state.song_url+'.m4a'}
            controls
            autoPlay
            ref={(element) => { this.player = element; }}
          />
          <WrappedComponent
            playBuzzIn={this.playBuzzIn}
            playCommercialBreak={this.playCommercialBreak}
            playFastMoneyReveal={this.playFastMoneyReveal}
            playFullTheme={this.playFullTheme}
            playMediumTheme={this.playMediumTheme}
            playNumberOne={this.playNumberOne}
            playRight={this.playRight}
            playShortTheme={this.playShortTheme}
            playTimesUp={this.playTimesUp}
            playWrongLong={this.playWrongLong}
            playWrongShort={this.playWrongShort}
            play={this.play}
            pause={this.pause}
            toggle={this.toggle}
            restart={this.restart}
            {...this.props} />
        </Fragment>
      );
    }
  }
};

export default withAudio;