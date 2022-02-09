import { EventEmitter } from "events";

const createEventEmitter = () => {
  const emitter = new EventEmitter();
  return {
    emit: emitter.emit.bind(emitter),
    on: (event, listener) => {
      const cb = listener.bind(null);
      emitter.on(event, cb);
      return () => emitter.off(event, cb);
    },
    prepend: (event, listener) => {
      const cb = listener.bind(null);
      emitter.prependListener(event, cb);
      return () => emitter.off(event, cb);
    },
  };
};

export default createEventEmitter;
