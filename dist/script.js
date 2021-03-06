/**
 * A model for the each session.
 */
class Session {
  constructor(title, length) {
    this.title = title;
    this.length = length;
  }}


Vue.component("session", {
  template: "#session-template",

  props: {
    session: Session },


  methods: {
    /**
     * Decrement the session length.
     */
    decrement() {
      if (this.session.length > 1) {
        this.session.length--;
      }
    },

    /**
     * Increment the session length.
     */
    increment() {
      this.session.length++;
    } } });



new Vue({
  el: "#app",

  data: {
    /**
     * Instead of only having Work & Break, I made it customizable,
     * so you can add sessions and change the title and the length of each
     * session as you like.
     */
    sessions: [new Session("Work", 25), new Session("Break", 5)],

    /**
     * How much time is left before switching 
     * to the next session (measured  in seconds).
     */
    timer: 0,

    /**
     * What is the index of the currently running session?
     */
    currentSessionIndex: 0,

    /**
     * Are we currently counting down? (AKA: Did the timer start?).
     */
    isRunning: false },

  watch: {
    /**
     * Reset the timer whenever the current session length changes.
     */
    "currentSession.length": {
      handler() {
        this.resetTimer();
      },

      /**
       * To immedately set the timer at the startup 
       * of the appto match the current session
       */
      immediate: true } },



  computed: {
    /**
     * Timer formatted as HH:MM:SS.
     */
    formattedTimer() {
      return secondsToHms(this.timer);
    },

    /**
     * Get the object that represents the current working session.
     */
    currentSession() {
      return this.sessions[this.currentSessionIndex];
    },

    /**
     * Basicly, it calculates the percentage (%) 
     * of how much time has been elapsed.
     */
    fillHeight() {
      const totalTime = this.currentSession.length * 60;
      const elapsedTime = totalTime - this.timer;

      return elapsedTime / totalTime * 100 + "%";
    } },


  methods: {
    /**
     * Start the timer.
     */
    start() {
      this.isRunning = true;

      // Saving the interval ID to use it later to stop the timer.
      this.intervalID = setInterval(() => {
        // Once the timer reaches 0 switch between sessions (session, break).
        if (--this.timer == 0) {
          this.nextSession();
        }
      }, 1000);
    },

    /**
     * Stop the timer.
     */
    stop() {
      this.isRunning = false;
      clearInterval(this.intervalID);
    },

    /**
     * Move to the next session, or go back 
     * to the first session if there were no session left.
     */
    nextSession() {
      if (++this.currentSessionIndex == this.sessions.length) {
        this.currentSessionIndex = 0;
      }

      this.resetTimer();
    },

    /**
     * Resets the timer to match the length of the current session,
     * and also convert it from minutes to seconds.
     */
    resetTimer() {
      this.timer = this.currentSession.length * 60;
    },

    /**
     * Add a new session.
     */
    newSession() {
      const title = `Untitled Session`;
      this.sessions.push(new Session(title, 5));
    },

    /**
     * Deletes the given session. 
     * Only works if there are more than 2 sessions.
     */
    deleteSession(session) {
      if (this.sessions.length == 2) {
        alert("There must be at least 2 sessions!");
        return;
      }

      for (let i = 0; i < this.sessions.length; i++) {
        if (this.sessions[i] == session) {
          this.sessions.splice(i, 1);
        }
      }
    } } });



/**
 * Convert seconds to HH:MM:SS formated time.
 *
 * @link https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
 */
function secondsToHms(seconds) {
  return new Date(seconds * 1000).
  toISOString().
  substr(11, 8) // To only get the HH:MM:SS part
  .replace(/^00:/, ""); // To remove 00: from the beginning (e.g 00:12:34)
}