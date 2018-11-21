from flask import Flask
from flask_restful import Resource, Api, reqparse

from onmt.translate import TranslationServer, ServerModelError

import logging
logging.getLogger("flask_ask").setLevel(logging.DEBUG)


STATUS_OK = "ok"
STATUS_ERROR = "error"


app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()

translation_server = TranslationServer()
translation_server.start('conf.json')
translation_server.models[0].to_cpu()
print(translation_server.list_models())


class Service(Resource):

    def NLG(self,input):
        #insert your NLG solution here
        output="you said "+input
        inputs = [{"id": 0, "src": input}]
        try:
            translation, scores, n_best, times = translation_server.run(inputs)

            out = [[{"src": inputs[i]['src'], "tgt": translation[i],
                     "n_best": n_best,
                     "pred_score": scores[i]}
                    for i in range(len(translation))]]
            print(out)

            
            print("inputs:", inputs, " translation:", translation)
            output = translation[0]
        except:
            pass

        return(output)


    def post(self):
        parser.add_argument('input', type=str)
        args = parser.parse_args()
        output=self.NLG(args['input'])
        return {
            'output': '{}'.format(output)
        }


api.add_resource(Service, '/')

if __name__ == '__main__':
    app.run(debug=True)
