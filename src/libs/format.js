let format = {

};
format.QuestionListToHtml =function(data){
    let HtmlList = data.map((e, i) => {
        if(e.group_type ==1){
            if(e.question_type ==1 || e.question_type ==2){
                try {
                    e.answer = JSON.parse(e.answer);    
                    e.options = JSON.parse(e.options);
                } catch (error) {
                    console.error(e.question_id+' JSON.parse fail!');
                }
            }
            e.quesHtml = this.formatQuestionHtml(false,0,e.title,e.options);
        }else{
            e.answer =[];
            e.questionList =[];
            e.analysis = "";
            e.default_score = 0;
            e.sub_questions.forEach((q,j) =>{
                try {
                    q.answer = q.question_type == 3? q.answer : JSON.parse(q.answer);     
                    if(q.answer instanceof Array){
                        q.answer = q.answer[0];
                    }                 
                } catch (error) {
                    q.answer = q.answer
                    console.error(e.question_id+'sub_questions JSON.parse fail!');                    
                    console.error('sub_questions id: '+q.id);                    
                }
                e.answer.push(q.answer);
                let options = "";
                try {
                    options= q.question_type == 3? q.options:JSON.parse(q.options);                
                } catch (error) {
                    options = q.options;
                    console.error(e.question_id+'sub_questions JSON.parse fail!');                    
                    console.error('sub_questions id: '+q.id);                    
                }
                e.questionList.push({
                    html:this.formatQuestionHtml(true,j,q.title,options),
                    default_score:q.default_score
                });
                if (q.analysis !== "") {
                    e.analysis += "<p>" + (j+1) + ".&nbsp;"+q.analysis.substr(3);
                }else{
                    e.analysis += "<p>"+ (j+1) + ".&nbsp;</p>";
                }
                e.default_score += q.default_score;
            });               
            e.sub_questions = null;
        }
        e.showAnswer = false;
        e.isAdd = false;
        return e;
    });

    return HtmlList;
}
format.formatQuestionHtml = function (showNum,i, title, options) {
    let titleHtml = "";
    let quesHtml = "";
    let optionHtml = "";
    let quesNum = "";
    if(showNum){
        quesNum = "<span style='width:25px;padding-top: 2px;'>" + (i + 1) + ".&nbsp;</span>";
    }
    if (options && options != "") {
        optionHtml = this.formatOptions(options);
    }
    if (title !== "") {
        titleHtml += "<p>" + quesNum + title.substr(3);
        quesHtml = titleHtml + optionHtml;
    } else {
        titleHtml = "<div style='display:flex;'>"
        quesHtml = titleHtml + quesNum + optionHtml + "</div>";
    }
    return quesHtml;
};
format.formatOptions = function (options) {
    let maxLength = 0;
    options.forEach(e => {
        maxLength = e.option.length > maxLength ? e.option.length : maxLength;
    });
    let lineItemCount = 1;
    let itemWidth = "100%";
    if (maxLength <= 20) {
        lineItemCount = 4;
        itemWidth = "25%";
        if (options.length == 2) {
            lineItemCount = 2;
            itemWidth = "50%";
        }
        if (options.length == 3) {
            lineItemCount = 3;
            itemWidth = "33%";
        }
    } else if (maxLength > 20 && maxLength < 40) {
        lineItemCount = 2;
        itemWidth = "50%";
    }
    let optionHtml = lineItemCount == 1? "<div>":"<table style=\"margin-top: 5px\" width=\"100%\">";
    options.forEach((e, i) => {
        if (lineItemCount == 1) {
            optionHtml += "<p>" + e.index + ".&nbsp;" + e.option + "</p>";
        } else {
            if (i % lineItemCount == 0) {
                optionHtml += "<tr>";
            }
            optionHtml += "<td width=\"" + itemWidth + "\" valign=\"middle\">" + e.index + ".&nbsp;" + e.option + "</td>";
            if ((i % lineItemCount) + 1 == lineItemCount) {
                optionHtml += "</tr>";
            }
        }
    });
    optionHtml+=lineItemCount == 1? "</div>":"</table>";
    return optionHtml;
};
export default format;